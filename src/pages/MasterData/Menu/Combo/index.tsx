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
import { useDeleteComboGroupsMutation, useGetComboGroupsQuery } from '@apis'
import { flatToTree } from '@utils/trees'
import { TreePage } from '../../../../layout/TreePage'
import { useTablesStore } from '../../../../store'
import ComboGroupDetail from './ComboGroupDetail'
import ComboList from './ComboList'

const Combo = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const match = useMatch({ path: 'menu/combo-groups/*' })
  const selectedTreeKey = match?.pathname.split('/')[3] || '0'
  const [selectedKey, setSelectedKey] = useState(selectedTreeKey)
  const showDeletedGroup = useTablesStore(store => store.combo.showDeletedGroup)
  useEffect(() => {
    setSelectedKey(selectedTreeKey)
  }, [selectedTreeKey])

  const { data } = useGetComboGroupsQuery(
    {
      status: showDeletedGroup ? undefined : [1, 2, 3, 4],
      modiGroupType: 1,
    },
    {
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteCombogroups } = useDeleteComboGroupsMutation({
    onSuccess: () => {
      queryClient.invalidateQueries('getComboGroups')
      message.success({ content: t('combo.group.delete.success') })
      navigate('/menu/combo-groups')
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
        'combo',
        id => deleteCombogroups([id]),
        key => setSelectedKey(key)
      ),
    [data, deleteCombogroups]
  )

  const onSelect = (keys: React.Key[]) => {
    setSelectedKey(`${keys[0]}`)
    navigate(`${keys[0]}`)
  }

  return (
    <TreePage
      title={t('combo.item.combos')}
      treeData={treeData}
      selectedKeys={[selectedKey]}
      selectedTreeKeys={[selectedTreeKey]}
      onAddTreeItem={() => navigate(`${selectedKey}/combo-groups`)}
      onKeySelect={onSelect}
    >
      <Routes>
        <Route path=":id" element={<ComboList />} />
        <Route path=":id/detail" element={<ComboGroupDetail />} />
        <Route path=":id/combo-groups" element={<ComboGroupDetail />} />
        <Route path="" element={<Navigate to="0" />} />
      </Routes>
    </TreePage>
  )
}

export default Combo
