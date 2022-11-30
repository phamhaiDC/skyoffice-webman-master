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
import { useDeleteMenuGroupsMutation, useGetMenuGroupsQuery } from '@apis'
import { flatToTree } from '@utils/trees'
import { TreePage } from '../../../../layout/TreePage'
import { useTablesStore } from '../../../../store'
import MenuGroupDetail from './MenuGroupDetail'
import MenuItemList from './MenuItemList'

const MenuItem = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const match = useMatch({ path: 'menu/menu-groups/*' })
  const selectedTreeKey = match?.pathname.split('/')[3] || '0'
  const [selectedKey, setSelectedKey] = useState(selectedTreeKey)
  const showDeletedGroup = useTablesStore(
    store => store.menuItem.showDeletedGroup
  )
  const [menuItemsTitle, setMenuItemsTitle] = useState<string>('')

  useEffect(() => {
    setSelectedKey(selectedTreeKey)
  }, [selectedTreeKey])

  const { data } = useGetMenuGroupsQuery(
    {
      status: showDeletedGroup ? undefined : [1, 2, 3, 4],
    },
    {
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteModigroups } = useDeleteMenuGroupsMutation({
    onSuccess: () => {
      queryClient.invalidateQueries('getMenuGroups')
      message.success({ content: t('menuItem.group.delete.success') })
      navigate('/menu/menu-groups')
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
      title={t('menuItem.item.menuItems')}
      treeData={treeData}
      selectedKeys={[selectedKey]}
      selectedTreeKeys={[selectedTreeKey]}
      onAddTreeItem={() => navigate(`${selectedKey}/menu-groups`)}
      onKeySelect={onSelect}
    >
      <Routes>
        <Route
          path=":id"
          element={<MenuItemList menuItemsTitle={menuItemsTitle} />}
        />
        <Route
          path=":id/detail"
          element={
            <MenuGroupDetail
              setMenuItemsTitle={setMenuItemsTitle}
              menuItemsTitle={menuItemsTitle}
            />
          }
        />
        <Route
          path=":id/menu-groups"
          element={
            <MenuGroupDetail
              setMenuItemsTitle={setMenuItemsTitle}
              menuItemsTitle={menuItemsTitle}
            />
          }
        />
        <Route path="" element={<Navigate to="0" />} />
      </Routes>
    </TreePage>
  )
}

export default MenuItem
