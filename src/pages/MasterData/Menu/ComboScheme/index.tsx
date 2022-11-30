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
import { useDeleteComboSchemesMutation, useGetComboSchemesQuery } from '@apis'
import { flatToTree } from '@utils/trees'
import { TreePage } from '../../../../layout/TreePage'
import { useTablesStore } from '../../../../store'
import ComboSchemeList from './ComboSchemeItem/ComboSchemeItemList'
import ComboSchemeGroup from './ComboSchemeGroup'

const ComboScheme = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const match = useMatch({ path: 'menu/combo-schemes/*' })
  const selectedTreeKey = match?.pathname.split('/')[3] || '0'
  const [selectedKey, setSelectedKey] = useState(selectedTreeKey)
  const showDeletedGroup = useTablesStore(
    store => store.comboScheme.showDeletedGroup
  )
  useEffect(() => {
    setSelectedKey(selectedTreeKey)
  }, [selectedTreeKey])

  const { data } = useGetComboSchemesQuery(
    {
      status: showDeletedGroup ? undefined : [1, 2, 3, 4],
      modiSchemeType: 3,
    },
    {
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteComboschemes } = useDeleteComboSchemesMutation({
    onSuccess: () => {
      queryClient.invalidateQueries('getComboSchemes')
      message.success({ content: t('comboScheme.delete.success') })
      navigate('/menu/combo-schemes')
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
        'comboScheme',
        id => deleteComboschemes([id]),
        key => setSelectedKey(key)
      ),
    [data, deleteComboschemes]
  )

  const onSelect = (keys: React.Key[]) => {
    setSelectedKey(`${keys[0]}`)
    navigate(`${keys[0]}`)
  }

  return (
    <TreePage
      title={t('comboScheme.comboSchemes')}
      treeData={treeData}
      selectedKeys={[selectedKey]}
      selectedTreeKeys={[selectedTreeKey]}
      onAddTreeItem={() => navigate(`${selectedKey}/schemes`)}
      onKeySelect={onSelect}
    >
      <Routes>
        <Route path=":id" element={<ComboSchemeList />} />
        <Route path=":id/detail" element={<ComboSchemeGroup />} />
        <Route path=":id/schemes" element={<ComboSchemeGroup />} />
        <Route path="" element={<Navigate to="0" />} />
      </Routes>
    </TreePage>
  )
}

export default ComboScheme
