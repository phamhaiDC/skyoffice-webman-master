import {
  Cash,
  Classification,
  Concept,
  Currency,
  Discount,
  Employee,
  HourlySaleByRestaurants,
  MenuItem,
  Modifier,
  PriceType,
  Region,
  Restaurant,
  RevenueByDays,
  RevenueByDiscounts,
  RevenueByEmployees,
  RevenueByRestaurants,
  TaxGroup,
} from 'models'
import { Status } from '../../models/swagger'
import { Columns } from './types'

export const DEFAULT_STATUS_FILTER: Status[] = [1, 2, 3, 4]

export const DEFAULT_REGIONS_COLUMNS: Columns<Region> = {
  id: { fixed: true },
  name: { fixed: true },
  altName: {},
  code: {},
  status: { checked: true },
}

export const DEFAULT_CONCEPTS_COLUMNS: Columns<Concept> = {
  id: { fixed: true },
  name: { fixed: true },
  altName: {},
  code: {},
  status: { checked: true },
}

export const DEFAULT_RESTAURANTS_COLUMNS: Columns<Restaurant> = {
  id: { fixed: true },
  name: { fixed: true },
  altName: {},
  code: {},
  status: { checked: true },
}

export const DEFAULT_MODIFIERS_COLUMNS: Columns<Modifier> = {
  id: { fixed: true },
  name: { fixed: true },
  altName: {},
  code: {},
  status: { checked: true },
}

export const DEFAULT_MENU_ITEMS_COLUMNS: Columns<MenuItem> = {
  id: { fixed: true },
  name: { fixed: true },
  altName: {},
  code: {},
  status: { checked: true },
}

export const DEFAULT_PRICE_TYPES_COLUMNS: Columns<PriceType> = {
  id: { fixed: true },
  name: { fixed: true },
  altName: {},
  code: {},
  status: { checked: true },
}

export const DEFAULT_DISCOUNTS_COLUMNS: Columns<Discount> = {
  id: { fixed: true },
  name: { fixed: true },
  altName: {},
  code: {},
  status: { checked: true },
}

export const DEFAULT_TAX_GROUPS_COLUMNS: Columns<TaxGroup> = {
  id: { fixed: true },
  name: { fixed: true },
  altName: {},
  code: {},
  status: { checked: true },
  isDefaultTaxDishType: {},
}

export const DEFAULT_CURRENCIES_COLUMNS: Columns<Currency> = {
  id: { fixed: true },
  name: { fixed: true },
  altName: {},
  code: {},
  status: { checked: true },
}

export const DEFAULT_CLASSIFICATIONS_COLUMNS: Columns<Classification> = {
  id: { fixed: true },
  name: { fixed: true },
  altName: {},
  code: {},
  status: { checked: true },
}

export const DEFAULT_CASHES_COLUMNS: Columns<Cash> = {
  id: { fixed: true },
  name: { fixed: true },
  altName: {},
  code: {},
  status: { checked: true },
}

export const DEFAULT_EMPLOYEES_COLUMNS: Columns<Employee> = {
  id: { fixed: true },
  name: { fixed: true },
  altName: {},
  status: { checked: true },
}

export const DEFAULT_REVENUE_BY_DAYS_COLUMNS: Columns<RevenueByDays> = {
  shift_date: { fixed: true },
  check_count: { checked: true },
  guest_count: { checked: true },
  discount_sum: { checked: true },
  services_charge: { checked: true },
  tax_sum: { checked: true },
  amount_before_tax: { fixed: true },
  pay_sum: { fixed: true },
  price_sum: { checked: true },
  // restaurant_id: {},
  // restaurant_name: {},
  // calc_percent: {},
  // alt_name: {},
}

export const DEFAULT_REVENUE_BY_RESTAURANTS_COLUMNS: Columns<RevenueByRestaurants> =
  {
    restaurant_name: { fixed: true },
    restaurant_id: { checked: true },
    check_count: { checked: true },
    guest_count: { checked: true },
    price_sum: { checked: true },
    discount_sum: { checked: true },
    services_charge: { checked: true },
    amount_before_tax: { fixed: true },
    tax_sum: { checked: true },
    pay_sum: { fixed: true },
    // calc_percent: {},
    // alt_name: {},
  }

export const DEFAULT_LIST_OF_RECEIPTS_COLUMNS: Columns<RevenueByRestaurants> = {
  restaurant_name: { fixed: true },
  restaurant_id: { checked: true },
  check_count: { checked: true },
  guest_count: { checked: true },
  price_sum: { checked: true },
  discount_sum: { checked: true },
  services_charge: { checked: true },
  amount_before_tax: { fixed: true },
  tax_sum: { checked: true },
  pay_sum: { fixed: true },
  // calc_percent: {},
  // alt_name: {},
}

export const DEFAULT_REVENUE_BY_DISCOUNTS_COLUMNS: Columns<RevenueByDiscounts> =
  {
    discount_id: { fixed: true },
    discount_name: { checked: true },
    check_count: { checked: true },
    quantity: { checked: true },
    discount_sum: { checked: true },
    pay_sum: { checked: true },
    calc_percent: { checked: true },
    // amount_before_tax: { fixed: true },
    // tax_sum: { checked: true },
    // pay_sum: { fixed: true },
    // calc_percent: {},
    // alt_name: {},
  }

export const DEFAULT_HOURLY_SALE_BY_RESTAURANTS_COLUMNS: Columns<HourlySaleByRestaurants> =
  {
    hourly: { fixed: true },
    restaurant_id: { checked: true },
    restaurant_name: { fixed: true },
    alt_name: {},
    check_count: { checked: true },
    guest_count: { checked: true },
    price_sum: { fixed: true },
    pay_sum: { fixed: true },
    calc_percent: { checked: true },
    // pay_sum: { fixed: true },
    // calc_percent: {},
    // alt_name: {},
  }

export const DEFAULT_REVENUE_BY_EMPLOYEES_COLUMNS: Columns<RevenueByEmployees> =
  {
    cashier_id: {},
    cashier_name: { fixed: true },
    check_count: { fixed: true },
    price_sum: { fixed: true },
    pay_sum: { fixed: true },
    calc_percent: { checked: true },
    // pay_sum: { fixed: true },
    // calc_percent: {},
    // alt_name: {},
  }
