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
import { useDeleteCashGroupsMutation, useGetCashGroupsQuery } from '@apis'
import { flatToTree } from '@utils/trees'
import { TreePage } from '../../../../layout/TreePage'
import { useTablesStore } from '../../../../store'
import CashDetail from './CashDetail'
import CashGroupDetail from './CashGroupDetail'
import CashList from './CashList'

const Cash = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const match = useMatch({ path: 'administration/cash-groups/*' })
  const selectedTreeKey = match?.pathname.split('/')[3] || '0'
  const [selectedKey, setSelectedKey] = useState(selectedTreeKey)
  const showDeletedGroup = useTablesStore(store => store.cash.showDeletedGroup)

  useEffect(() => {
    setSelectedKey(selectedTreeKey)
  }, [selectedTreeKey])

  const { data } = useGetCashGroupsQuery(
    {
      status: showDeletedGroup ? undefined : [1, 2, 3, 4],
    },
    {
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteCashGroups } = useDeleteCashGroupsMutation({
    onSuccess: () => {
      queryClient.invalidateQueries('getCashGroups')
      message.success({ content: t('cash.group.delete.success') })
      navigate('/administration/cash-groups')
    },
    onError: (e: any) => {
      message.error({ content: e.message })
    },
  })

  const treeData = useMemo(
    () =>
      data &&
      flatToTree(
        data.cashGroups || [],
        'cash',
        id => deleteCashGroups([id]),
        key => setSelectedKey(key)
      ),
    [data, deleteCashGroups]
  )

  const onSelect = (keys: React.Key[]) => {
    setSelectedKey(`${keys[0]}`)
    navigate(`${keys[0]}`)
  }

  return (
    <TreePage
      title={t('cash.item.cashes')}
      treeData={treeData}
      selectedKeys={[selectedKey]}
      selectedTreeKeys={[selectedTreeKey]}
      onAddTreeItem={() => navigate(`${selectedKey}/cash-groups`)}
      onKeySelect={onSelect}
    >
      <Routes>
        <Route path=":id" element={<CashList />} />
        <Route path=":id/detail" element={<CashGroupDetail />} />
        <Route path=":id/cash-groups" element={<CashGroupDetail />} />
        <Route path=":id/cashes/:cashId" element={<CashDetail />} />
        <Route path=":id/cashes" element={<CashDetail />} />
        <Route path="" element={<Navigate to="0" />} />
      </Routes>
    </TreePage>
  )
}

export default Cash
