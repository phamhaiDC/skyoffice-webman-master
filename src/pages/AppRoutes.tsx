import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '@store'
import Adminstration from './MasterData/Administration'
import Finance from './MasterData/Finance'
import Menu from './MasterData/Menu'
import Dashboard from './Dashboard'
import Reports from './Reports'

const AppRoutes = () => {
  const { orgId } = useAuthStore()

  if (!orgId) {
    return <Navigate to="select-org" />
  }

  return (
    <Routes>
      <Route path="dashboard/*" element={<Dashboard />} />
      <Route path="menu/*" element={<Menu />} />
      <Route path="finance/*" element={<Finance />} />
      <Route path="administration/*" element={<Adminstration />} />
      <Route path="reports/*" element={<Reports />} />
      <Route path="" element={<Navigate to="dashboard/" />} />
    </Routes>
  )
}

export default AppRoutes
