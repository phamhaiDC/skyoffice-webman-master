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
import {
  useDeleteClassificationsMutation,
  useGetClassificationGroupsQuery,
} from '@apis'
import { flatToTree } from '@utils/trees'
import { TreePage } from '../../../../layout/TreePage'
import { useTablesStore } from '../../../../store'
import ClassificationDetail from './ClassificationDetail'
import ClassificationGroupDetail from './ClassificationGroupDetail'
import ClassificationList from './ClassificationList'

const ClassificationGroup = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const match = useMatch({ path: 'menu/classification-groups/*' })
  const selectedTreeKey = match?.pathname.split('/')[3] || '0'
  const [selectedKey, setSelectedKey] = useState(selectedTreeKey)
  const showDeletedGroup = useTablesStore(
    store => store.classification.showDeletedGroup
  )

  useEffect(() => {
    setSelectedKey(selectedTreeKey)
  }, [selectedTreeKey])

  const { data } = useGetClassificationGroupsQuery(
    {
      status: showDeletedGroup ? undefined : [1, 2, 3, 4],
      parentId: 0,
    },
    {
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteModigroups } = useDeleteClassificationsMutation({
    onSuccess: () => {
      queryClient.invalidateQueries('getClassificationGroups')
      message.success({ content: t('classification.group.delete.success') })
      navigate('/menu/classification-groups')
    },
    onError: (e: any) => {
      message.error({ content: e.message })
    },
  })
  const treeData = useMemo(
    () =>
      data &&
      flatToTree(
        data.classificatorGroups || [],
        'classification',
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
      title={t('classification.item.classificationGroups')}
      treeData={treeData}
      selectedKeys={[selectedKey]}
      selectedTreeKeys={[selectedTreeKey]}
      onKeySelect={onSelect}
      onAddTreeItem={() => navigate(`${selectedKey}/classification-groups`)}
    >
      <Routes>
        <Route path=":classificationGroupId" element={<ClassificationList />} />
        <Route
          path=":classificationGroupId/detail"
          element={<ClassificationGroupDetail />}
        />
        <Route
          path=":classificationGroupId/classification-groups"
          element={<ClassificationGroupDetail />}
        />
        <Route
          path=":classificationGroupId/classifications/:classificationId"
          element={<ClassificationDetail />}
        />
        <Route
          path=":classificationGroupId/classifications"
          element={<ClassificationDetail />}
        />
        <Route path="" element={<Navigate to="0" />} />
      </Routes>
    </TreePage>
  )
}

export default ClassificationGroup
