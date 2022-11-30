import { Navigate, Route, Routes } from 'react-router-dom'
import Scrollable from '../../layout/Scrollable'
import Chain from './Chain'
import Restaurant from './Restaurant'

const Dashboard = () => {
  return (
    <Scrollable className="!p-0">
      <Routes>
        <Route path="chain" element={<Chain />} />
        <Route path="restaurant" element={<Restaurant />} />
        <Route element={<Navigate to="chain" />} path="" />
      </Routes>
    </Scrollable>
  )
}

export default Dashboard
