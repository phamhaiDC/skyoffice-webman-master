import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import {
  Navigate,
  Route,
  Routes,
  useMatch,
  useNavigate,
} from 'react-router-dom'
import { message } from 'antd'
import { useDeleteModiGroupsMutation, useGetModiGroupsQuery } from '@apis'
import { flatToTree } from '@utils/trees'
import { TreePage } from '../../../../layout/TreePage'
import { useTablesStore } from '../../../../store'
import ModifierList from './ModifierList'
import ModiGroupDetail from './ModiGroupDetail'

const Modifier = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const match = useMatch({ path: 'menu/modi-groups/*' })
  const selectedTreeKey = match?.pathname.split('/')[3] || '0'
  const [selectedKey, setSelectedKey] = useState(selectedTreeKey)
  const showDeletedGroup = useTablesStore(
    store => store.modifier.showDeletedGroup
  )

  useEffect(() => {
    setSelectedKey(selectedTreeKey)
  }, [selectedTreeKey])

  const { data } = useGetModiGroupsQuery(
    {
      status: showDeletedGroup ? undefined : [1, 2, 3, 4],
      modiGroupType: 0,
    },
    {
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteModigroups } = useDeleteModiGroupsMutation({
    onSuccess: () => {
      queryClient.invalidateQueries('getModiGroups')
      message.success({ content: t('modifier.group.delete.success') })
      navigate('/menu/modi-groups')
    },
    onError: (e: any) => {
      message.error({ content: e.message })
    },
  })

  const treeData = useMemo(
    () =>
      data &&
      flatToTree(
        data.modiGroups || [],
        'modifier',
        id => deleteModigroups([id]),
        key => setSelectedKey(key)
      ),
    [data, deleteModigroups]
  )

  const onSelect = (keys: React.Key[]) => {
    setSelectedKey(`${keys[0]}`)
    navigate(`${keys[0]}`)
  }
  return (
    <TreePage
      title={t('modifier.item.modifiers')}
      treeData={treeData}
      selectedKeys={[selectedKey]}
      selectedTreeKeys={[selectedTreeKey]}
      onAddTreeItem={() => navigate(`${selectedKey}/modi-groups`)}
      onKeySelect={onSelect}
    >
      <Routes>
        <Route path=":id" element={<ModifierList />} />
        <Route path=":id/detail" element={<ModiGroupDetail />} />
        <Route path=":id/modi-groups" element={<ModiGroupDetail />} />
        <Route path="" element={<Navigate to="0" />} />
      </Routes>
    </TreePage>
  )
}

export default Modifier
