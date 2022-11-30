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
import { useDeleteDiscountTypesMutation, useGetDiscountTypesQuery } from '@apis'
import { flatToTree } from '@utils/trees'
import { TreePage } from '../../../../layout/TreePage'
import { useTablesStore } from '../../../../store'
import DiscountList from './DiscountList'
import DiscountTypeDetail from './DiscountTypeDetail'

const DiscountType = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const match = useMatch({ path: 'finance/discount-types/*' })
  const selectedTreeKey = match?.pathname.split('/')[3] || '0'
  const [selectedKey, setSelectedKey] = useState(selectedTreeKey)
  const showDeletedGroup = useTablesStore(
    store => store.discount.showDeletedGroup
  )

  useEffect(() => {
    setSelectedKey(selectedTreeKey)
  }, [selectedTreeKey])

  const onSelect = (keys: React.Key[]) => {
    setSelectedKey(`${keys[0]}`)
    navigate(`${keys[0]}`)
  }

  const { data } = useGetDiscountTypesQuery(
    {
      status: showDeletedGroup ? undefined : [1, 2, 3, 4],
    },
    {
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteDiscountTypes } = useDeleteDiscountTypesMutation({
    onSuccess: () => {
      queryClient.invalidateQueries('getDiscountTypes')
      message.success({ content: t('discount.type.delete.success') })
      navigate('/finance/discount-types')
    },
    onError: (e: any) => {
      message.error({ content: e.message })
    },
  })

  const treeData = useMemo(
    () =>
      data &&
      flatToTree(
        data.discountTypes || [],
        'discount',
        id => deleteDiscountTypes([id]),
        key => setSelectedKey(`${key}`)
      ),
    [data, deleteDiscountTypes]
  )

  return (
    <TreePage
      title={t('discount.type.discountTypes')}
      treeData={treeData}
      selectedKeys={[selectedKey]}
      selectedTreeKeys={[selectedTreeKey]}
      onAddTreeItem={() => navigate(`${selectedKey}/discount-types`)}
      onKeySelect={onSelect}
    >
      <Routes>
        <Route path=":id" element={<DiscountList />} />
        <Route path=":id/detail" element={<DiscountTypeDetail />} />
        <Route path=":id/discount-types" element={<DiscountTypeDetail />} />
        <Route path="" element={<Navigate to="0" />} />
      </Routes>
    </TreePage>
  )
}

export default DiscountType
