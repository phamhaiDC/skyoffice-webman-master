import produce from 'immer'
import {
  Cash,
  Classification,
  Combo,
  ComboScheme,
  Concept,
  Currency,
  Discount,
  Employee,
  HourlySaleByRestaurants,
  MenuItem,
  Modifier,
  ModiScheme,
  PriceType,
  Region,
  Restaurant,
  RevenueByDays,
  RevenueByDiscounts,
  RevenueByEmployees,
  RevenueByRestaurants,
  TaxGroup,
} from 'models'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { Status } from '../../models/swagger'
import {
  DEFAULT_CASHES_COLUMNS,
  DEFAULT_CLASSIFICATIONS_COLUMNS,
  DEFAULT_CONCEPTS_COLUMNS,
  DEFAULT_CURRENCIES_COLUMNS,
  DEFAULT_DISCOUNTS_COLUMNS,
  DEFAULT_EMPLOYEES_COLUMNS,
  DEFAULT_HOURLY_SALE_BY_RESTAURANTS_COLUMNS,
  DEFAULT_LIST_OF_RECEIPTS_COLUMNS,
  DEFAULT_MENU_ITEMS_COLUMNS,
  DEFAULT_MODIFIERS_COLUMNS,
  DEFAULT_PRICE_TYPES_COLUMNS,
  DEFAULT_REGIONS_COLUMNS,
  DEFAULT_RESTAURANTS_COLUMNS,
  DEFAULT_REVENUE_BY_DAYS_COLUMNS,
  DEFAULT_REVENUE_BY_DISCOUNTS_COLUMNS,
  DEFAULT_REVENUE_BY_EMPLOYEES_COLUMNS,
  DEFAULT_REVENUE_BY_RESTAURANTS_COLUMNS,
  DEFAULT_STATUS_FILTER,
  DEFAULT_TAX_GROUPS_COLUMNS,
} from './constants'
import { Column, Columns, Screen } from './types'

type TableState<T = {}> = {
  columns: Columns<T>
  showDeletedGroup?: boolean
}

type State = {
  region: TableState<Region>
  concept: TableState<Concept>
  restaurant: TableState<Restaurant>
  modifier: TableState<Modifier>
  menuItem: TableState<MenuItem>
  priceType: TableState<PriceType>
  combo: TableState<Combo>
  discount: TableState<Discount>
  taxGroup: TableState<TaxGroup>
  modiScheme: TableState<ModiScheme>
  currency: TableState<Currency>
  classification: TableState<Classification>
  cash: TableState<Cash>
  comboScheme: TableState<ComboScheme>
  employee: TableState<Employee>
  limit: number
  revenueByDays: TableState<RevenueByDays>
  revenueByDiscounts: TableState<RevenueByDiscounts>
  revenueByRestaurants: TableState<RevenueByRestaurants>
  listOfReceipts: TableState<RevenueByRestaurants>
  revenueByEmployees: TableState<RevenueByEmployees>
  hourlySalesByRestaurants: TableState<HourlySaleByRestaurants>
  setLimit: (_limit: number) => void
  setColumns: (screen: Screen, value: Columns) => void
  setShowDeletedGroup: (screen: Screen, value: boolean) => void
  status: Status[]
  setStatus: (_status: Status[]) => void
}

export const useTablesStore = create<State>()(
  persist(
    set => ({
      region: { columns: DEFAULT_REGIONS_COLUMNS },
      concept: { columns: DEFAULT_CONCEPTS_COLUMNS },
      restaurant: { columns: DEFAULT_RESTAURANTS_COLUMNS },
      modifier: { columns: DEFAULT_MODIFIERS_COLUMNS },
      menuItem: { columns: DEFAULT_MENU_ITEMS_COLUMNS },
      priceType: { columns: DEFAULT_PRICE_TYPES_COLUMNS },
      combo: { columns: DEFAULT_MODIFIERS_COLUMNS },
      discount: { columns: DEFAULT_DISCOUNTS_COLUMNS },
      taxGroup: { columns: DEFAULT_TAX_GROUPS_COLUMNS },
      modiScheme: { columns: DEFAULT_TAX_GROUPS_COLUMNS },
      currency: { columns: DEFAULT_CURRENCIES_COLUMNS },
      comboScheme: { columns: DEFAULT_TAX_GROUPS_COLUMNS },
      revenueByDays: { columns: DEFAULT_REVENUE_BY_DAYS_COLUMNS },
      revenueByDiscounts: { columns: DEFAULT_REVENUE_BY_DISCOUNTS_COLUMNS },
      revenueByRestaurants: { columns: DEFAULT_REVENUE_BY_RESTAURANTS_COLUMNS },
      revenueByEmployees: { columns: DEFAULT_REVENUE_BY_EMPLOYEES_COLUMNS },
      hourlySalesByRestaurants: {
        columns: DEFAULT_HOURLY_SALE_BY_RESTAURANTS_COLUMNS,
      },
      classification: {
        columns: DEFAULT_CLASSIFICATIONS_COLUMNS,
      },
      listOfReceipts: { columns: DEFAULT_LIST_OF_RECEIPTS_COLUMNS },
      status: DEFAULT_STATUS_FILTER,
      setStatus: _status =>
        set({
          status: _status,
        }),
      cash: { columns: DEFAULT_CASHES_COLUMNS },
      employee: { columns: DEFAULT_EMPLOYEES_COLUMNS },
      limit: 10,
      setLimit: _limit =>
        set({
          limit: _limit,
        }),
      setColumns: (screen, columns) =>
        set(
          produce(store => {
            store[screen].columns = columns
          })
        ),
      setShowDeletedGroup: (screen, value) =>
        set(
          produce(store => {
            store[screen].showDeletedGroup = value
          })
        ),
    }),
    { name: 'tablesStore' }
  )
)

export { type Column, type Columns, type Screen }
