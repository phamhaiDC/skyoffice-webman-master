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
import { useDeleteModiSchemesMutation, useGetModiSchemesQuery } from '@apis'
import { flatToTree } from '@utils/trees'
import { TreePage } from '../../../../layout/TreePage'
import { useTablesStore } from '../../../../store'
import ModiSchemeItemList from './ModiSchemeItem/ModiSchemeItemList'
import ModiSchemeGroup from './ModiSchemeGroup'

const ModiScheme = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const match = useMatch({ path: 'menu/modifier-schemes/*' })
  const selectedTreeKey = match?.pathname.split('/')[3] || '0'
  const [selectedKey, setSelectedKey] = useState(selectedTreeKey)
  const showDeletedGroup = useTablesStore(
    store => store.modiScheme.showDeletedGroup
  )

  useEffect(() => {
    setSelectedKey(selectedTreeKey)
  }, [selectedTreeKey])

  const { data } = useGetModiSchemesQuery(
    {
      status: showDeletedGroup ? undefined : [1, 2, 3, 4],
      modiSchemeType: 2,
    },
    {
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteModischemes } = useDeleteModiSchemesMutation({
    onSuccess: () => {
      queryClient.invalidateQueries('getModiSchemes')
      message.success({ content: t('modiScheme.delete.success') })
      navigate('/menu/modifier-schemes')
    },
    onError: (e: any) => {
      message.error({ content: e.message })
    },
  })
  const treeData = useMemo(
    () =>
      data &&
      flatToTree(
        data.modiSchemes || [],
        'modiScheme',
        id => deleteModischemes([id]),
        key => setSelectedKey(key)
      ),
    [data, deleteModischemes]
  )

  const onSelect = (keys: React.Key[]) => {
    setSelectedKey(`${keys[0]}`)
    navigate(`${keys[0]}`)
  }

  return (
    <TreePage
      title={t('modiScheme.modischemes')}
      treeData={treeData}
      selectedKeys={[selectedKey]}
      selectedTreeKeys={[selectedTreeKey]}
      onAddTreeItem={() => navigate(`${selectedKey}/schemes`)}
      onKeySelect={onSelect}
    >
      <Routes>
        <Route path=":id" element={<ModiSchemeItemList />} />
        <Route path=":id/detail" element={<ModiSchemeGroup />} />
        <Route path=":id/schemes" element={<ModiSchemeGroup />} />
        <Route path="" element={<Navigate to="0" />} />
      </Routes>
    </TreePage>
  )
}

export default ModiScheme
