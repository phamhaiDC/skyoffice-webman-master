import { Navigate, Route, Routes } from 'react-router-dom'
import Finances from './Finance'
import Revenue from './Revenue'

const Reports = () => {
  return (
    <Routes>
      <Route element={<Revenue />} path="revenue/*" />
      <Route element={<Navigate to="revenue/sales-summary/" />} path="" />
      <Route element={<Finances />} path="Finance/*" />
      <Route element={<Navigate to="discounts/" />} path="" />
    </Routes>
  )
}

export default Reports
