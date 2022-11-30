import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Dropdown, Menu, Switch } from 'antd'
import { DataNode } from 'antd/lib/tree'
import { t as translation } from 'i18next'
import { ModiGroup } from 'models'
import { DefaultOptionType } from 'rc-tree-select/lib/TreeSelect'
import styled from 'styled-components'
import tw from 'twin.macro'
import { ReactComponent as EditIcon } from '@assets/icons/Edit.svg'
import { ReactComponent as MoreIcon } from '@assets/icons/MoreForTree.svg'
import { ReactComponent as TrashIcon } from '@assets/icons/Trash.svg'
import { ReactComponent as TreeRootIcon } from '@assets/icons/TreeRootIcon.svg'
import { Screen, useTablesStore } from '../store'
import { confirm } from './modal'

type ActionListProps = {
  onDeleteModigroups: () => void
  onChangeSelectedKey: () => void
  modiGroupsId: number
}

type ActionAllProps = {
  screen: Screen
  onChangeSelectedKey: () => void
}

const ActionList = ({
  onDeleteModigroups,
  onChangeSelectedKey,
  modiGroupsId,
}: ActionListProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [visible, setVisible] = useState(false)

  const actionList = (
    <Menu
      items={[
        {
          label: (
            <span className="flex items-center min-w-[120px]">
              <EditIcon className="mr-2" /> {t('common.edit')}
            </span>
          ),
          key: '1',
          onClick: e => {
            e.domEvent.stopPropagation()
            onChangeSelectedKey()
            navigate(`${modiGroupsId}/detail`)
          },
        },
        {
          label: (
            <span className="flex items-center min-w-[120px]">
              <TrashIcon className="mr-2" /> {t('common.delete')}
            </span>
          ),
          key: '2',
          onClick: e => {
            e.domEvent.stopPropagation()
            confirm(t('common.confirm.delete'), 'danger', onDeleteModigroups)()
          },
        },
      ]}
    />
  )

  return (
    <Dropdown
      overlay={actionList}
      className="dropdown right-4"
      onVisibleChange={setVisible}
    >
      <StyledButton
        size="small"
        shape="circle"
        className={visible ? 'visible' : 'invisible'}
        // onClick={e => e.stopPropagation()}
      >
        <MoreIcon className="float-right mt-1" />
      </StyledButton>
    </Dropdown>
  )
}

const ActionAll = ({ screen, onChangeSelectedKey }: ActionAllProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [visible, setVisible] = useState(false)
  const showDeletedGroup = useTablesStore(
    state => state[screen].showDeletedGroup
  )
  const setShowDeletedGroup = useTablesStore(state => state.setShowDeletedGroup)

  const actionAll = (
    <Menu
      items={[
        {
          label: (
            <span className="flex items-center min-w-[120px]">
              <div className="flex items-center gap-2 justify-between">
                <span> {t('common.showDeleted')}</span>
                <Switch
                  size="small"
                  checked={showDeletedGroup}
                  onChange={e => {
                    setShowDeletedGroup(screen, e)
                    navigate('0')
                  }}
                />
              </div>
            </span>
          ),
          key: '0',
          onClick: e => {
            e.domEvent.stopPropagation()
            onChangeSelectedKey()
          },
        },
      ]}
    />
  )

  return (
    <Dropdown
      overlay={actionAll}
      className="dropdown right-4"
      onVisibleChange={setVisible}
    >
      <StyledButton
        size="small"
        shape="circle"
        className={visible ? 'visible' : 'invisible'}
        // onClick={e => e.stopPropagation()}
      >
        <MoreIcon className="float-right mt-1" />
      </StyledButton>
    </Dropdown>
  )
}

const StyledButton = styled(Button)`
  ${tw`inline-flex justify-center top-1/2 absolute`}
  transform: translateY(-50%);
`

export const flatToTree = (
  flat: any[],
  screen: Screen,
  onDeleteModigroups: (id: number) => void,
  onChangeSelectedKey: (id: string) => void,
  showMoreButton = true
): DataNode[] => {
  const innerProcess = (data: any[], parentId = 0): DataNode[] => {
    const treeData = data
      .filter(i => i.parentId === parentId)
      .map<DataNode>(item => {
        const children = innerProcess(flat, item.id)

        return {
          className: 'item',
          key: `${item.id}`,
          title: (
            <>
              {item.name}
              {showMoreButton && (
                <ActionList
                  onDeleteModigroups={() => onDeleteModigroups(item.id)}
                  onChangeSelectedKey={() => onChangeSelectedKey(`${item.id}`)}
                  modiGroupsId={item.id}
                />
              )}
            </>
          ),
          children,
        }
      })

    return treeData
  }

  return [
    {
      className: 'item',
      key: '0',
      title: (
        <>
          {translation('common.all')}
          {showMoreButton && (
            <ActionAll
              screen={screen}
              onChangeSelectedKey={() => onChangeSelectedKey('0')}
            />
          )}
        </>
      ),
      icon: <TreeRootIcon />,
      children: innerProcess(flat.filter(i => i.id !== 0)),
    },
  ]
}

export const findAllParents = (selected: number, flat: ModiGroup[]) => {
  const family: ModiGroup[] = []
  let parentId = selected
  let current
  while (
    // eslint-disable-next-line
    (current = flat.find(item => item.id === parentId)) !== undefined
  ) {
    family.unshift(current)
    parentId = current.parentId

    if (current.id === 0) break
  }

  return family.map(i => `${i.id}`)
}

export const flatTreeSelectData = (flat: any[]): DefaultOptionType[] => {
  const innerProcess = (data: any[], parentId = 0): DefaultOptionType[] => {
    const treeData = data
      .filter(i => i.parentId === parentId)
      .map<DefaultOptionType>(item => {
        const children = innerProcess(flat, item.id)
        return {
          className: 'item',
          value: item.id,
          key: item.id,
          children,
          title: item.name,
          selectable: item.selectable,
        }
      })

    return treeData
  }
  return innerProcess(flat.filter(i => i.id !== 0))
}
