import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { t } from 'i18next'
import AppLayout from '@layout/index'
import { MainRoute, MASTER_DATA_PAGES } from '@layout/pages'
import AppRoutes from './pages/AppRoutes'
import SelectOrg from './pages/SelectOrg'
import { useAuthStore } from './store'

const App = () => {
  const { user } = useAuthStore()
  const { pathname } = useLocation()

  useEffect(() => {
    const [, mainRoute, route] = pathname.split('/')

    if (!mainRoute) return

    if (MASTER_DATA_PAGES(t)[mainRoute as MainRoute]) {
      document.title = `SkyOffice | ${
        MASTER_DATA_PAGES(t)[mainRoute as MainRoute][route]?.label
      }`
      return
    }

    document.title = `SkyOffice | ${mainRoute[0].toUpperCase()}${mainRoute.slice(
      1
    )}`
  }, [pathname])

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return (
    <Routes>
      <Route path="select-org" element={<SelectOrg />} />
      <Route
        path="*"
        element={
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        }
      />
    </Routes>
  )
}

export default App
