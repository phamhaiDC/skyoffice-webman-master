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
import { useDeleteGroupRolesMutation, useGetGroupRolesQuery } from '@apis'
import { flatToTree } from '@utils/trees'
import { TreePage } from '../../../../layout/TreePage'
import { useTablesStore } from '../../../../store'
import EmployeeDetail from './EmployeeDetail'
import EmployeeList from './EmployeeList'
import GroupRoleDetail from './GroupRoleDetail'

const Employee = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const match = useMatch({ path: 'administration/group-roles/*' })
  const selectedTreeKey = match?.pathname.split('/')[3] || '0'
  const [selectedKey, setSelectedKey] = useState(selectedTreeKey)
  const showDeletedGroup = useTablesStore(
    store => store.employee.showDeletedGroup
  )
  useEffect(() => {
    setSelectedKey(selectedTreeKey)
  }, [selectedTreeKey])

  const { data } = useGetGroupRolesQuery(
    {
      status: showDeletedGroup ? undefined : [1, 2, 3, 4],
    },
    {
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteModigroups } = useDeleteGroupRolesMutation({
    onSuccess: () => {
      queryClient.invalidateQueries('getGroupRoles')
      message.success({ content: t('employee.group.delete.success') })
      navigate('/administration/group-roles')
    },
    onError: (e: any) => {
      message.error({ content: e.message })
    },
  })

  const treeData = useMemo(
    () =>
      data &&
      flatToTree(
        data.roles || [],
        'employee',
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
      title={t('employee.item.employees')}
      treeData={treeData}
      selectedKeys={[selectedKey]}
      selectedTreeKeys={[selectedTreeKey]}
      onAddTreeItem={() => navigate(`${selectedKey}/group-roles`)}
      onKeySelect={onSelect}
    >
      <Routes>
        <Route path=":id" element={<EmployeeList />} />
        <Route path=":id/detail" element={<GroupRoleDetail />} />
        <Route path=":id/group-roles" element={<GroupRoleDetail />} />
        <Route path=":id/employees/:employeeId" element={<EmployeeDetail />} />
        <Route path=":id/employees" element={<EmployeeDetail />} />
        <Route path="" element={<Navigate to="0" />} />
      </Routes>
    </TreePage>
  )
}

export default Employee
