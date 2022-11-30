import { Navigate, Route, Routes } from 'react-router-dom'
import CurrencyType from './Currency'
import DiscountType from './Discount'
import PriceType from './PriceType'
import TaxGroup from './TaxGroup'

const Finance = () => {
  return (
    <Routes>
      <Route element={<PriceType />} path="price-types/*" />
      <Route element={<DiscountType />} path="discount-types/*" />
      <Route element={<TaxGroup />} path="tax-groups/*" />
      <Route element={<CurrencyType />} path="currency-types/*" />
      <Route path="" element={<Navigate to="currencies" />} />
    </Routes>
  )
}

export default Finance
