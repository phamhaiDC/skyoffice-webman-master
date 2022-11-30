import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { t } from 'i18next'
import { useAuthStore } from '@store'
import Login from './Login'

const Auth: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = `${t('auth.login.login')} | SkyOffice`
  }, [])

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="" element={<Navigate to="login" />} />
    </Routes>
  )
}

export default Auth
