import { Navigate, Route, Routes } from 'react-router-dom'
import ListOfReceipts from './ListOfReceipts'
import RevenueByDays from './RevenueByDays'
import RevenueByEmployees from './RevenueByEmployees'
import RevenueByRestaurants from './RevenueByRestaurants'
import SalesByCategories from './SalesByCategories'
import SalesByDishes from './SalesByDishes'
import SalesSummary from './SalesSummary'

const Revenue = () => {
  return (
    <Routes>
      <Route path="sales-summary/*" element={<SalesSummary />} />
      <Route path="revenue-by-days/*" element={<RevenueByDays />} />
      <Route
        path="revenue-by-restaurants/*"
        element={<RevenueByRestaurants />}
      />

      <Route path="list-of-receipts/*" element={<ListOfReceipts />} />
      <Route path="revenue-by-employees/*" element={<RevenueByEmployees />} />
      <Route path="sales-by-dishes/*" element={<SalesByDishes />} />
      <Route path="sales-by-categories/*" element={<SalesByCategories />} />

      <Route element={<Navigate to="sales-summary/*" />} path="" />
    </Routes>
  )
}

export default Revenue
