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
import { useDeleteCurrencyTypesMutation, useGetCurrencyTypesQuery } from '@apis'
import { flatToTree } from '@utils/trees'
import { TreePage } from '../../../../layout/TreePage'
import { useTablesStore } from '../../../../store'
import CurrencyDetail from './CurrencyDetail'
import CurrencyList from './CurrencyList'
import CurrencyTypeDetail from './CurrencyTypeDetail'

const CurrencyType = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const match = useMatch({ path: 'finance/currency-types/*' })
  const selectedTreeKey = match?.pathname.split('/')[3] || '0'
  const [selectedKey, setSelectedKey] = useState(selectedTreeKey)
  const showDeletedGroup = useTablesStore(
    store => store.currency.showDeletedGroup
  )

  useEffect(() => {
    setSelectedKey(selectedTreeKey)
  }, [selectedTreeKey])

  const { data } = useGetCurrencyTypesQuery(
    {
      status: showDeletedGroup ? undefined : [1, 2, 3, 4],
    },
    {
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteModigroups } = useDeleteCurrencyTypesMutation({
    onSuccess: () => {
      queryClient.invalidateQueries('getCurrencyTypes')
      message.success({ content: t('currency.type.delete.success') })
      navigate('/finance/currency-types')
    },
    onError: (e: any) => {
      message.error({ content: e.message })
    },
  })

  const treeData = useMemo(
    () =>
      data &&
      flatToTree(
        data.currencyTypes || [],
        'currency',
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
      title={t('currency.item.currencies')}
      treeData={treeData}
      selectedKeys={[selectedKey]}
      selectedTreeKeys={[selectedTreeKey]}
      onAddTreeItem={() => navigate(`${selectedKey}/currency-types`)}
      onKeySelect={onSelect}
    >
      <Routes>
        <Route path=":id" element={<CurrencyList />} />
        <Route path=":id/detail" element={<CurrencyTypeDetail />} />
        <Route path=":id/currency-types" element={<CurrencyTypeDetail />} />
        <Route path=":id/currencies/:currencyId" element={<CurrencyDetail />} />
        <Route path=":id/currencies" element={<CurrencyDetail />} />
        <Route path="" element={<Navigate to="0" />} />
      </Routes>
    </TreePage>
  )
}

export default CurrencyType
