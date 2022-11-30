import { Navigate, Route, Routes } from 'react-router-dom'
import HoursReports from './HoursReports'
import ListOfDiscounts from './ListOfDiscounts'

const Finances = () => {
  return (
    <Routes>
      <Route path="discounts/*" element={<ListOfDiscounts />} />
      <Route path="HoursReports/*" element={<HoursReports />} />
      <Route element={<Navigate to="discounts/*" />} path="" />
    </Routes>
  )
}

export default Finances
