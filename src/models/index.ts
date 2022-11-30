import { UploadFile } from 'antd/es/upload'
import { t } from 'i18next'
import { ModiGroupTypes, Status } from './swagger'

export type Organization = { id: number; name: string }

export type LoginResponse = {
  token: {
    accessToken: string
    refreshToken: string
  }
  name: string
  login: string
  organizations: Organization[]
}

export type RefreshTokenResponse = {
  accessToken: string
  refreshToken: string
}

export type Bit = 0 | 1

// Common
type Collection<T, Name extends string> = {
  [key in Name]: T[]
} & { total: number }

export const CommonStatus: { [key in Status]: string } = {
  0: t('common.status.deleted'),
  1: t('common.status.draft'),
  2: t('common.status.inactive'),
  3: t('common.status.active'),
  4: t('common.status.preset'),
}

type CreateStatusType = 1 | 2 | 3

export const CreateStatus: { [key in CreateStatusType]: string } = {
  1: t('common.status.draft'),
  2: t('common.status.inactive'),
  3: t('common.status.active'),
}

// Concept
export type Concept = {
  id: number
  name: string
  code?: number
  altName?: string
  status: Status
}

export type ConceptCreateInputs = Omit<Concept, 'id'>

export type GetConceptsResponse = Collection<Concept, 'concepts'>

export type ConceptUpdateInputs = Partial<ConceptCreateInputs> & {
  id: number
}

// Region
export type Region = {
  id: number
  name: string
  code?: number
  altName?: string
  status: Status
}

export type RegionCreateInputs = Omit<Region, 'id'>

export type GetRegionsResponse = Collection<Region, 'regions'>

export type RegionUpdateInputs = Partial<RegionCreateInputs> & {
  id: number
}

// Restaurant
export type Restaurant = {
  id: number
  name: string
  code?: number
  altName?: string
  status: Status
  address?: string
  region?: Region
  concept?: Concept
}

export type RestaurantCreateInputs = Omit<
  Restaurant,
  'id' | 'region' | 'concept'
> & {
  regionId: number
  conceptId: number
}

export type GetRestaurantsResponse = Collection<Restaurant, 'restaurants'>

export type RestaurantUpdateInputs = Partial<RestaurantCreateInputs> & {
  id: number
}

// Modifier
export type Modifier = {
  id: number
  name: string
  code?: number
  extCode?: number
  altName?: string
  status: Status
  parentId?: number
  // basic
  addToName?: number
  replaceName?: number
  saveInReceipt?: number
  inputName?: Bit
  // portion
  maxInOneDish?: number
  maxInOneDishCount?: number
  weight?: number
  // restriction
  rightLevel?: number
  startingSale?: number
  startingSaleDate?: Date
  endingSale?: number
  endingSaleDate?: Date
  // prices
  priceTypes?: Price[]
}

export type ModifierCreateInputs = Omit<Modifier, 'id'>

export type GetModifiersResponse = Collection<Modifier, 'modifiers'>

export type ModifierUpdateInputs = Partial<ModifierCreateInputs> & {
  id: number
}

export interface ModifiersListParams {
  orgId?: number
  parentId?: number
  search?: string
  offset?: number
  limit?: number
  orderBy?: string
  status?: Status[]
  modiType?: number
}

// Modi-group
export type ModiGroup = {
  id: number
  name: string
  code?: number
  status: Status
  parentId: number
  modiGroupType: ModiGroupTypes
  guid?: string
  comment?: string
}

export type ModiGroupCreateInputs = Omit<ModiGroup, 'id' | 'modiGroupType'>

export type GetModiGroupsResponse = Collection<ModiGroup, 'modiGroups'>

export type ModiGroupUpdateInputs = Partial<ModiGroupCreateInputs> & {
  id: number
}

// Rate class
export type RateClass = {
  id: number
  name: string
  code?: number
  altName?: string
  status: Status
  rate?: number
  isoCode?: string
}

export type RateClassCreateInputs = Omit<RateClass, 'id'>

export type RateClassUpdateInputs = Partial<RateClassCreateInputs>

export type GetRateClassesResponse = Collection<RateClass, 'rateClasses'>

export interface RateClassesListParams {
  /** @format int32 */
  orgId?: number
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
}

// Currency type
export type CurrencyType = {
  id: number
  name: string
  code?: number
  altName?: string
  status: Status
  description?: string
  parentId?: number
}

export type CurrencyTypeCreateInputs = Omit<CurrencyType, 'id'>

export type CurrencyTypeUpdateInputs = Partial<CurrencyTypeCreateInputs> & {
  id: number
}

export type GetCurrencyTypesResponse = Collection<CurrencyType, 'currencyTypes'>

export interface CurrencyTypesListParams {
  /** @format int32 */
  orgId?: number
  search?: string

  /** @format int32 */
  offset?: number
  status?: Status[]

  /** @format int32 */
  limit?: number
  orderBy?: string
}

// Currency
export type Currency = {
  id: number
  name: string
  code?: number
  altName?: string
  status: Status
}

export type CurrencyCreateInputs = Omit<Currency, 'id'> & {
  parentId: number
}

export type CurrencyUpdateInputs = Partial<
  Omit<CurrencyCreateInputs, 'parentId'>
> & {
  id: number
}

export type GetCurrenciesResponse = Collection<Currency, 'currencies'>

export interface CurrenciesListParams {
  /** @format int32 */
  orgId?: number
  // id of currency type
  parentId?: number
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
}

// PriceType
export type PriceType = {
  id: number
  name: string
  code?: number
  altName?: string
  status: Status
}

export type PriceTypeCreateInputs = Omit<PriceType, 'id'>

export type PriceTypeUpdateInputs = Partial<PriceTypeCreateInputs> & {
  id: number
}

export type GetPriceTypesResponse = Collection<PriceType, 'priceTypes'>

export interface PriceTypesListParams {
  /** @format int32 */
  orgId?: number
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
  status?: Status[]
}

export type Price = {
  id: number
  name: string
  species: number
  value?: number | null
  description?: string
}

export type SaleObjectType = 0 | 2

export type AddLineModeType = 0 | 1 | 2

export const AddLineMode: { [key in AddLineModeType]: string } = {
  0: t('common.addLineMode.join'),
  1: t('common.addLineMode.separateLine'),
  2: t('common.addLineMode.separateLineForeachPortion'),
}

export type PriceModeType = 0 | 1 | 2 | 3

export const PriceMode: { [key in PriceModeType]: string } = {
  0: t('common.addLineMode.perPiece'),
  1: t('common.addLineMode.perStandardDose'),
  2: t('common.addLineMode.perPortionUnitOfWeight'),
  3: t('common.addLineMode.perStandardPortion'),
}

export type RightLevelType = 0

export const RightLevel: { [key in RightLevelType]: string } = {
  0: t('common.rightLevel.test'),
}

// MenuItem
export type MenuItem = {
  id: number
  name: string
  code?: number
  altName?: string
  status: Status
  parentId?: number
  saleObjectType?: SaleObjectType
  modiScheme?: ModiScheme
  comboScheme?: ModiScheme
  taxDishType?: number
  guid?: string
  priceTypes?: Price[]
  classificatorGroups?: Classification[]
  addLineMode?: AddLineModeType
  portionName?: string
  altPortion?: string
  priceMode?: PriceModeType
  portionWeight?: number
  qntDecDigits?: number
  useRestControl?: boolean
  minRestQnt?: number
  useConfirmQnt?: boolean
  confirmQnt?: number
  useStartSale?: boolean
  useStopSale?: boolean
  salesTermsStartSale?: Date
  salesTermsStopSale?: Date
  refId?: number
}

export type MenuItemCreateInputs = {
  name?: string
  saleObjectType: SaleObjectType
  parentId: number
}

export type GetMenuItemsResponse = Collection<MenuItem, 'menuItems'>

export type ImageObject = {
  id: string
  binary: string
  mimeType: string
  sortOrder?: number
  imageUrl: string
}
export type MenuItemsUpdateInputs = Partial<
  Omit<MenuItem, 'id' | 'modiScheme'>
> & {
  id: number
  modiSchemeId?: number
  comboSchemeId?: number
  images?: ImageObject[]
}

export interface MenuItemsListParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  parentId?: number
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
  status?: Status[]
  saleObjectType?: SaleObjectType
}

// MenuItem-Pictures
export interface MenuItemPicturesListParams {
  orgId?: number
  refId: number
}

// Menu-groups
export type MenuGroup = {
  id: number
  name: string
  code?: number
  status: Status
  parentId: number
  modiGroupType: ModiGroupTypes
  guid?: string
  description?: string
}

export type MenuGroupCreateInputs = Omit<MenuGroup, 'id' | 'modiGroupType'>

export type GetMenuGroupsResponse = Collection<MenuGroup, 'categList'>

export type MenuGroupsUpdateInputs = Partial<MenuGroupCreateInputs> & {
  id: number
}

// discount type
export type DiscountType = {
  id: number
  name: string
  code?: number
  status: Status
  parentId?: number
  description?: string
}

export type DiscountTypeCreateInputs = Omit<DiscountType, 'id'>

export type GetDiscountTypesResponse = Collection<DiscountType, 'discountTypes'>

export type DiscountTypesUpdateInputs = Partial<DiscountTypeCreateInputs> & {
  id: number
}

export interface DiscountTypesListParams {
  orgId?: number
  search?: string
  orderBy?: string
  status?: Status[]
}

// discount
export type DiscountModeValue = 0 | 1

export const DiscountMode: { [key in DiscountModeValue]: string } = {
  0: t('discount.item.mode.down'),
  1: t('discount.item.mode.up'),
}

export type CountTypeValue = 0 | 1

export const CountType: { [key in CountTypeValue]: string } = {
  0: t('discount.item.countType.amount'),
  1: t('discount.item.countType.percent'),
}

export type RoundRuleValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export const RoundRule: { [key in RoundRuleValue]: string } = {
  0: '0.01',
  1: '0.05',
  2: '0.10',
  3: '0.50',
  4: '1.00',
  6: '10.00',
  8: '100.00',
  10: '1000.00',
  5: '5.00',
  7: '50.00',
  9: '500.00',
}

export type DiscountObjectTypeValue = 1 | 2 | 3 | 4

export const DiscountObjectType: { [key in DiscountObjectTypeValue]: string } =
  {
    1: t('discount.item.discountObjectType.discount'),
    2: t('discount.item.discountObjectType.discountInsteadPayment'),
    3: t('discount.item.discountObjectType.markup'),
    4: t('discount.item.discountObjectType.undistributedMarkup'),
  }

export type MinQuantityTypeValue = 0 | 1 | 2 | 3
export const MinQuantityValue: { [key in MinQuantityTypeValue]: string } = {
  0: t('discount.item.minQuantityObjectType.forAll'),
  1: t('discount.item.minQuantityObjectType.forEachNth'),
  2: t('discount.item.minQuantityObjectType.forExacessAfterNth'),
  3: t('discount.item.minQuantityObjectType.onlyOneNth'),
}

export type Discount = {
  id: number
  name: string
  altName?: string
  code?: number
  extCode?: number
  status: Status
  parentId?: number
  discountObjectType?: DiscountObjectTypeValue
  mode?: DiscountModeValue
  countType?: CountTypeValue
  chargeMenuItem?: number
  allTaxIncluded?: number
  excludeFromEarnings?: number
  fiscalOutside?: number
  artCharges?: boolean
  combineWithAnyDisc?: boolean
  manualEnterMode?: boolean
  roundRule?: RoundRuleValue
  useMaxAmount?: boolean
  maxAmount?: number
  useMaxPercent?: boolean
  maxPercent?: number
  zeroAct?: boolean
  printZeroValue?: boolean
  discountDistrMode?: number
  surplusDistrMode?: number
  unfiscalOperation?: number
  allowMultiple?: boolean
  classification?: Classification
  minOrderRest?: number
  needMan?: boolean
  onOrder?: boolean
  onDish?: boolean
  onSeat?: boolean
  prohibitHand?: boolean
  useStartSale?: boolean
  useStopSale?: boolean
  salesTerms_StartSale?: Date
  salesTerms_StopSale?: Date
  ignoreCardExpireDate?: number
  magnCardType?: number
  mInterface?: number
  transactionCode?: number
  transactionValue?: number
  visualType_BColor?: number
  visualType_TextColor?: number
  guid?: string
  classificatorGroupId?: number
}

export type DiscountCreateInputs = {
  name: string
  discountObjectType?: number
  parentId?: number
}

export type GetDiscountsResponse = Collection<Discount, 'discounts'>

export type DiscountUpdateInputs = Partial<
  Omit<Discount, 'id' | 'classification'>
> & {
  id: number
  classificatorGroupId?: number
}

export interface DiscountsListParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  parentId?: number
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
  status?: Status[]
}

// discount detail
export type DiscountDetail = {
  id: number
  // discount?: Discount
  discountId?: number
  amount?: number
  percent?: number
  bonusPercentVal?: number
  bonusType?: number
  region?: Region
  concept?: Concept
  restaurant?: Restaurant
  guestType?: number
  useFromAmount?: boolean
  fromAmount?: number
  useFromGuest?: boolean
  fromGuest?: number
  useToGuest?: boolean
  toGuest?: number
  category?: Classification
  switchToPrice?: number
  guid?: string
}

export type DiscountDetailCreateInputs = Omit<
  DiscountDetail,
  'id' | 'region' | 'concept' | 'restaurant' | 'category'
> & {
  regionId?: number
  conceptId?: number
  restaurantId?: number
  categoryId?: number
}

export type GetDiscountDetailsResponse = Collection<
  DiscountDetail,
  'discountDetails'
>

export type DiscountDetailsUpdateInputs =
  Partial<DiscountDetailCreateInputs> & {
    id: number
  }

export interface DiscountDetailsListParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  parentId?: number

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
}

// Tax group
export type TaxGroup = {
  id: 2
  name: string
  altName?: string
  code?: number
  status: Status
  isDefaultTaxDishType?: boolean
  taxChar?: number
  guid?: string
  description?: string
}

export type TaxGroupCreateInputs = Omit<TaxGroup, 'id'>

export type GetTaxGroupsResponse = Collection<TaxGroup, 'taxGroups'>

export type TaxGroupUpdateInputs = Partial<TaxGroupCreateInputs> & {
  id: number
}

export interface TaxGroupsListParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
  status?: Status[]
}

// Combo
export type Combo = {
  id: number
  name: string
  code?: number
  extCode?: number
  altName?: string
  status: Status
  parentId?: number
  // portion
  maxInOneDish?: number
  maxInOneDishCount?: number
  weight?: number
  // restriction
  rightLevel?: number
  startingSale?: number
  startingSaleDate?: Date
  endingSale?: number
  endingSaleDate?: Date
  // prices
  priceTypes?: Price[]
  dish?: MenuItem
}

export type ComboCreateInputs = Omit<Combo, 'id'> & {
  dishId?: number
}

export type GetCombosResponse = Collection<Combo, 'modifiers'>

export type ComboUpdateInputs = Partial<ComboCreateInputs> & {
  id: number
}

export interface CombosListParams {
  orgId?: number
  parentId?: number
  search?: string
  offset?: number
  limit?: number
  orderBy?: string
  status?: Status[]
  modiType?: number
}

// Combo-group
export type ComboGroup = {
  id: number
  name: string
  code?: number
  status: Status
  parentId: number
  modiGroupType: ModiGroupTypes
  guid?: string
  description?: string
}

export type ComboGroupCreateInputs = Omit<ComboGroup, 'id'>

export type GetComboGroupsResponse = Collection<ComboGroup, 'modiGroups'>

export type ComboGroupUpdateInputs = Partial<ModiGroupCreateInputs> & {
  id: number
}

// Classification group
export type Classification = {
  id: number
  name: string
  altName?: string
  code?: number
  extCode?: number
  status: Status
  parentId?: number
  numInGroup?: number
  guid?: string
  description?: string
  // basic
  barCodes?: string
  groupingRequired?: number
  // restriction
  minimalRest?: Bit
  minimalRestVal?: number
  rightLevel?: number
  startingSale?: Bit
  startingSaleDate?: Date
  endingSale?: Bit
  endingSaleDate?: Date
  // prices
  prices?: Price[]
  // portion
  addLineMode?: AddLineModeType
  massAltName?: string
  useConfirmQuality?: Bit
  confirmQualyty?: number
  dontPack?: Bit
  massName?: string
  priceMode?: PriceModeType
  quantityPrecision?: number
}

export type ClassificationCreateInputs = Omit<Classification, 'id'>

export type GetClassificationsResponse = Collection<
  Classification,
  'classificatorGroups'
>

export type ClassificationUpdateInputs = Partial<ClassificationCreateInputs> & {
  id: number
}

export interface ClassificationsListParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  search?: string
  parentId?: number

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
  status?: Status[]
}

// ModiScheme
export type ModiScheme = {
  id: number
  name: string
  code?: number
  altName?: string
  status: Status
  parentId?: number
  modiSchemeType?: number
  guid?: string
  description?: string
  // basic
  useDownLimit?: Bit
  downLimit?: number
  freeCount?: number
  sHQuantity?: number
  useUpperLimit?: Bit
  upperLimit?: number
  // prices
  priceTypes?: Price[]
}

export type ModiSchemeCreateInputs = Omit<ModiScheme, 'id'>

export type GetModiSchemesResponse = Collection<ModiScheme, 'modiSchemes'>

export type ModiSchemeUpdateInputs = Partial<ModiSchemeCreateInputs> & {
  id: number
}

export interface ModiSchemesListParams {
  orgId?: number
  modiSchemeType?: number
  parentId?: number
  search?: string
  offset?: number
  limit?: number
  orderBy?: string
  status?: Status[]
}

// Modi scheme detail
export type ModiSchemeDetail = {
  id: number
  modiGroup?: ModiGroup
  name?: string
  modiScheme?: ModiScheme
  sortNum?: number
  upLimit?: number
  downLimit?: number
  defaultModifierId?: number
  useUpLimit?: number
  useDownLimit?: number
}

export type ModiSchemeDetailCreateInputs = Omit<
  ModiSchemeDetail,
  'id' | 'modiGroup' | 'modiScheme'
> & {
  modiGroupId?: number
  modiSchemeId: number
}

export type ModiSchemeDetailUpdateInputs = Partial<
  Omit<ModiSchemeDetailCreateInputs, 'modiGroupId' | 'modiSchemeId'>
> & {
  id: number
}

export type GetModiSchemeDetailsResponse = Collection<
  ModiSchemeDetail,
  'modiSchemeDetails'
>

export type ModiSchemeDetailsListParams = {
  parentId: number
  orgId?: number
}

// combo scheme detail
export type ComboSchemeDetail = {
  id: number
  modiGroup?: ComboGroup
  modiScheme?: ComboScheme
  sortNum?: number
  upLimit?: number
  downLimit?: number
  defaultCombofierId?: number
}

export type ComboSchemeDetailCreateInputs = Omit<
  ComboSchemeDetail,
  'id' | 'modiGroup' | 'modiScheme'
> & {
  modiGroupId?: number
  modiSchemeId: number
}

export type ComboSchemeDetailUpdateInputs = Partial<
  Omit<ComboSchemeDetailCreateInputs, 'modiGroupId' | 'modiSchemeId'>
> & {
  id: number
}

export type GetComboSchemeDetailsResponse = Collection<
  ComboSchemeDetail,
  'modiSchemeDetails'
>

export type ComboSchemeDetailsListParams = {
  parentId: number
  orgId?: number
}

// Cash group
export type CashGroup = {
  id: number
  name: string
  code?: number
  altName?: string
  status: Status
  parentId?: number
  guid?: string
  description?: string
}

export type CashGroupCreateInputs = Omit<CashGroup, 'id'>

export type GetCashGroupsResponse = Collection<CashGroup, 'cashGroups'>

export type CashGroupUpdateInputs = Partial<CashGroupCreateInputs> & {
  id: number
}

export interface CashGroupsListParams {
  orgId?: number
  parentId?: number
  search?: string
  offset?: number
  limit?: number
  orderBy?: string
  status?: Status[]
}

// Cash
export type Cash = {
  id: number
  name: string
  code?: number
  altName?: string
  status: Status
  guid?: string
  parentId?: number
}

export type CashCreateInputs = Omit<Cash, 'id'>

export type GetCashesResponse = Collection<Cash, 'cashes'>

export type CashUpdateInputs = Partial<CashCreateInputs> & {
  id: number
}

export interface CashesListParams {
  orgId?: number
  parentId?: number
  search?: string
  offset?: number
  limit?: number
  orderBy?: string
  status?: Status[]
}

// ComboScheme
export type ComboScheme = {
  id: number
  name: string
  code?: number
  altName?: string
  status: Status
  ignoreDefault?: Bit
  parentId?: number
  modiSchemeType?: number
  guid?: string
  description?: string
  // basic
  useDownLimit?: Bit
  downLimit?: number
  freeCount?: number
  sHQuantity?: number
  useUpperLimit?: Bit
  upperLimit?: number
  priceTypes?: Price[]
}

export type ComboSchemeCreateInputs = Omit<ComboScheme, 'id'> & {
  objectPrivilegeId?: number
}

export type GetComboSchemesResponse = Collection<ComboScheme, 'modiSchemes'>

export type ComboSchemeUpdateInputs = Partial<ComboSchemeCreateInputs> & {
  id: number
}

export interface ComboSchemesListParams {
  orgId?: number
  modiSchemeType?: number
  parentId?: number
  search?: string
  offset?: number
  limit?: number
  orderBy?: string
  status?: Status[]
}

// Role group
export type GroupRole = {
  id: number
  name: string
  altName?: string
  status: Status
  parentId?: number
  type: number
  description?: string
}

export type GroupRoleCreateInputs = Omit<GroupRole, 'id'>

export type GetGroupRolesResponse = Collection<GroupRole, 'roles'>

export type GroupRoleUpdateInputs = Partial<GroupRoleCreateInputs> & {
  id: number
}

export interface GroupRolesListParams {
  orgId?: number
  status?: Status[]
}

// Employee
export type Employee = {
  id: number
  name: string
  altName?: string
  status: Status
  parentId?: number
  email?: string
  guid?: string
}

export type EmployeeCreateInputs = Omit<Employee, 'id'>

export type GetEmployeesResponse = Collection<Employee, 'employees'>

export type EmployeeUpdateInputs = Partial<Employee> & {
  id: number
}

export interface EmployeesListParams {
  orgId?: number
  parentId?: number
  search?: string
  offset?: number
  limit?: number
  orderBy?: string
  status?: Status[]
}

// GuestType
export type GuestType = {
  id: number
  name: string
  code?: number
  altName?: string
  status: Status
}

export type GuestTypeCreateInputs = Omit<GuestType, 'id'>

export type GetGuestTypesResponse = Collection<GuestType, 'guestTypes'>

export type GuestTypeUpdateInputs = Partial<GuestTypeCreateInputs> & {
  id: number
}

// revenueByDays
export type RevenueByDays = {
  shift_date: string
  restaurant_id?: number
  restaurant_name?: number
  alt_name?: string
  check_count: number
  guest_count: number
  price_sum?: number
  discount_sum: number
  services_charge: number
  tax_sum: number
  amount_before_tax?: number
  pay_sum?: number
  calc_percent?: number
}

export type GetRevenueByDaysResponse = Collection<RevenueByDays, 'details'>

export type RevenueByRestaurants = {
  restaurant_id: number
  restaurant_name: string
  alt_name?: string
  check_count: number
  guest_count: number
  price_sum: number
  discount_sum: number
  services_charge: number
  amount_before_tax: number
  tax_sum: number
  pay_sum: number
  calc_percent?: number
}

export type RevenueByRestaurantsResponse = RevenueByRestaurants[]

export type RevenueByDiscounts = {
  discount_id: number
  discount_name: string
  check_count: number
  quantity: number
  discount_sum: number
  pay_sum: number
  calc_percent: number
}

export type RevenueByDiscountsResponse = RevenueByDiscounts[]
// Revenue by hours in day Period 1hour
export type HourlySaleByRestaurants = {
  hourly: string
  restaurant_id: number
  restaurant_name: string
  alt_name?: string | undefined
  check_count: number
  guest_count: number
  price_sum: number
  pay_sum: number
  calc_percent: number
}

export type HourlySaleByRestaurantsResponse = HourlySaleByRestaurants[]

// revenue by Employee (Cashier)
export type RevenueByEmployees = {
  cashier_id: number
  cashier_name: string
  check_count: number
  price_sum: number
  pay_sum: number
  calc_percent: number
}

export type RevenueByEmployeesResponse = RevenueByEmployees[]
