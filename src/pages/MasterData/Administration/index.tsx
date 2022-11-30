import { Navigate, Route, Routes } from 'react-router-dom'
import Cash from './Cash'
import Concept from './Concept'
import Employee from './Employee'
import Region from './Region'
import Restaurant from './Restaurant'

const Adminstration = () => {
  return (
    <Routes>
      <Route element={<Concept />} path="concepts/*" />
      <Route element={<Restaurant />} path="restaurants/*" />
      <Route element={<Region />} path="regions/*" />
      <Route element={<Cash />} path="cash-groups/*" />
      <Route element={<Employee />} path="group-roles/*" />
      <Route element={<Navigate to="concepts" />} path="" />
    </Routes>
  )
}

export default Adminstration
