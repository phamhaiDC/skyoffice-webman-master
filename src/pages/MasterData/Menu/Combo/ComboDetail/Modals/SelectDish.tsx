import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useMatch } from 'react-router-dom'
import { message, Modal } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { useDeleteMenuGroupsMutation, useGetMenuGroupsQuery } from '@apis'
import { ReactComponent as CancelIcon } from '@assets/icons/Cancel.svg'
import AnimateIcon from '@components/elements/AnimateIcon'
import { MenuItem } from '@models'
import { flatToTree } from '@utils/trees'
import { TreePagePopUp } from '../../../../../../layout/TreePagePopUp'
import { MenuItemList } from './MenuItemList'

type Props = {
  visible: boolean
  onClose: () => void
  onOk: (menuItem: Pick<MenuItem, 'id' | 'name'>) => void
}

export const SelectDish: React.FC<Props> = ({ visible, onClose, onOk }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const match = useMatch({ path: 'menu/menu-groups/*' })

  const selectedTreeKey = match?.pathname.split('/')[3] || '0'

  const [selectedKey, setSelectedKey] = useState(selectedTreeKey)

  useEffect(() => {
    setSelectedKey(selectedTreeKey)
  }, [selectedTreeKey])

  const { data } = useGetMenuGroupsQuery(
    {},
    {
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteMenuGroups } = useDeleteMenuGroupsMutation({
    onSuccess: () => {
      queryClient.invalidateQueries('getMenuGroups')
      message.success({ content: t('menuItem.group.delete.success') })
    },
    onError: (e: any) => {
      message.error({ content: e.message })
    },
  })

  const treeData = useMemo(
    () =>
      data &&
      flatToTree(
        data.categList || [],
        'menuItem',
        id => deleteMenuGroups([id]),
        key => setSelectedKey(key),
        false
      ),
    [data, deleteMenuGroups]
  )

  const onSelect = (keys: React.Key[]) => {
    setSelectedKey(`${keys[0]}`)
  }

  return (
    <StyledModal
      visible={visible}
      onCancel={onClose}
      closable={false}
      footer={null}
      destroyOnClose
    >
      <Container>
        <Header>
          <Title>{t('combo.item.selectADish')}</Title>
          <AnimateIcon
            activeColor={theme`colors.white`}
            bgColor={theme`colors.red.500`}
            onClick={onClose}
          >
            <CancelIcon />
          </AnimateIcon>
        </Header>
        <TreePagePopUp
          treeData={treeData}
          selectedKeys={[selectedKey]}
          selectedTreeKeys={[selectedTreeKey]}
          onKeySelect={onSelect}
        >
          <MenuItemList
            customClass="pb-0"
            onClose={onClose}
            onOk={onOk}
            parentId={parseInt(selectedKey, 10)}
          />
        </TreePagePopUp>
      </Container>
    </StyledModal>
  )
}

const Container = styled.div`
  ${tw`flex flex-col h-full`}
`

const Header = styled.div`
  border-bottom: 1px solid ${theme`colors.table.line`};
  ${tw`h-12 flex justify-between gap-2 p-4 items-center`}
`

const Title = styled.span`
  ${tw`text-base font-medium text-gray-800`}
`

const StyledModal = styled(Modal)`
  min-width: 78.125rem;
  top: 3rem;
  height: calc(100vh - 6rem);
  padding-bottom: 0;

  .ant-modal-content {
    ${tw`!rounded-[2px] h-full `}
  }
  .ant-modal-body {
    ${tw`p-0 h-full `}
  }
`
