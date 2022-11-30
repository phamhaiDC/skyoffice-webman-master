export type Screen =
  | 'region'
  | 'modifier'
  | 'menuItem'
  | 'concept'
  | 'restaurant'
  | 'priceType'
  | 'combo'
  | 'discount'
  | 'taxGroup'
  | 'modiScheme'
  | 'currency'
  | 'classification'
  | 'cash'
  | 'comboScheme'
  | 'employee'
  | 'revenueByDays'
  | 'revenueByRestaurants'
  | 'listOfReceipts'
  | 'revenueByDiscounts'
  | 'hourlySalesByRestaurants'
  | 'revenueByEmployees'

export type Column = {
  checked?: boolean
  fixed?: boolean
}

export type Columns<T = {}> = {
  [key in keyof T]: Column
}
