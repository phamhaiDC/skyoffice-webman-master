/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CashDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status
  guid?: string | null
}

export interface CashGroupDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null
  status?: Status

  /** @format int32 */
  parentId?: number | null
  guid?: string | null
}

export interface ClassificatorGroupDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status

  /** @format int32 */
  parentId?: number | null

  /** @format int32 */
  numInGroup?: number | null
  guid?: string | null
}

export interface ConceptDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status
}

export interface CurrencyDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status
  guid?: string | null
}

export interface CurrencyTypeDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status
}

export interface DiscountDetailDto {
  /** @format int32 */
  id?: number

  /** @format int32 */
  discountId?: number | null

  /** @format int32 */
  amount?: number | null

  /** @format int32 */
  conceptId?: number | null

  /** @format int32 */
  regionId?: number | null

  /** @format int32 */
  restaurantId?: number | null
  guid?: string | null
}

export interface DiscountDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status

  /** @format int32 */
  maxAmount?: number | null

  /** @format int32 */
  maxPercent?: number | null

  /** @format int32 */
  parentId?: number | null
}

export interface DiscountTypeDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status
}

export interface LoginRequest {
  login?: string | null
  password?: string | null
}

export interface MenuGroupDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status

  /** @format int32 */
  parentId?: number | null
}

export interface MenuItemDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status

  /** @format int32 */
  parentId?: number | null

  /** @format int32 */
  saleObjectType?: number | null

  /** @format int32 */
  modiScheme?: number | null

  /** @format int32 */
  taxDishType?: number | null
  portionName?: string | null
  guid?: string | null
  prices?: PriceDto[] | null
  classificatorGroupDto?: ClassificatorGroupDto[] | null
}

export interface ModiGroupDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status

  /** @format int32 */
  parentId?: number | null
  modiGroupType?: ModiGroupTypes
  guid?: string | null
}

/**
 * @format int32
 */
export type ModiGroupTypes = 0 | 1 | 2 | 3

export interface ModiSchemeDetailDto {
  /** @format int32 */
  id?: number
  name?: string | null

  /** @format int32 */
  modiSchemeId?: number | null

  /** @format int32 */
  modiGroupId?: number | null

  /** @format int32 */
  sortNum?: number | null

  /** @format int32 */
  upLimit?: number | null

  /** @format int32 */
  downLimit?: number | null

  /** @format int32 */
  defaultModifierId?: number | null
  guid?: string | null
}

export interface ModiSchemeDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status
  modiSchemeType?: ModiSchemeTypes
  guid?: string | null
}

/**
 * @format int32
 */
export type ModiSchemeTypes = 0 | 1 | 2 | 3

export interface ModifierDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status

  /** @format int32 */
  parentId?: number | null

  /** @format int32 */
  dishId?: number | null
  guid?: string | null
}

export interface PriceDto {
  /** @format int32 */
  id?: number
  name?: string | null

  /** @format int32 */
  species?: number | null
  value?: string | null
}

export interface PriceTypeDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status
}

export interface RateClassDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status

  /** @format double */
  rate?: number | null
  isoCode?: string | null
  guid?: string | null
}

export interface RefreshTokenRequest {
  refreshToken?: string | null
}

export interface RegionDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status
}

export interface RestaurantDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null
  code?: string | null
  status?: Status

  /** @format int32 */
  regionId?: number | null

  /** @format int32 */
  conceptId?: number | null
  address?: string | null

  /** @format int32 */
  fullRestaurantCode?: number | null
  storeHouseCode?: string | null
  guid?: string | null
}

export interface RoleDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null
  status?: Status

  /** @format int32 */
  parentId?: number | null
  guid?: string | null
}

/**
 * @format int32
 */
export type Status = 0 | 1 | 2 | 3 | 4

export interface TaxGroupDto {
  /** @format int32 */
  id?: number
  name?: string | null
  altName?: string | null

  /** @format int32 */
  code?: number | null
  status?: Status

  /** @format int32 */
  isDefaultTaxDishType?: number | null

  /** @format int32 */
  taxChar?: number | null
  guid?: string | null
}

export interface CashesListParams {
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
}

export interface CashesCreateParams {
  /** @format int32 */
  orgId?: number
}

export type CashesUpdatePayload = CashDto[]

export interface CashesUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type CashesDeletePayload = number[]

export interface CashesDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface CashesDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface CashgroupsListParams {
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
}

export interface CashgroupsCreateParams {
  /** @format int32 */
  orgId?: number
}

export type CashgroupsUpdatePayload = CashGroupDto[]

export interface CashgroupsUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type CashgroupsDeletePayload = number[]

export interface CashgroupsDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface CashgroupsDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface ClassificatorgroupsListParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  parentId?: number
  search?: string
  orderBy?: string
}

export interface ClassificatorgroupsCreateParams {
  /** @format int32 */
  orgId?: number
}

export type ClassificatorgroupsUpdatePayload = ClassificatorGroupDto[]

export interface ClassificatorgroupsUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type ClassificatorgroupsDeletePayload = number[]

export interface ClassificatorgroupsDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface ClassificatorgroupsDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface ConceptsListParams {
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

export interface ConceptsCreateParams {
  /** @format int32 */
  orgId?: number
}

export type ConceptsUpdatePayload = ConceptDto[]

export interface ConceptsUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type ConceptsDeletePayload = number[]

export interface ConceptsDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface ConceptsDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface CurrenciesListParams {
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

export interface CurrenciesCreateParams {
  /** @format int32 */
  orgId?: number
}

export type CurrenciesUpdatePayload = CurrencyDto[]

export interface CurrenciesUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type CurrenciesDeletePayload = number[]

export interface CurrenciesDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface CurrenciesDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface CurrencytypesListParams {
  /** @format int32 */
  orgId?: number
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
}

export interface CurrencytypesCreateParams {
  /** @format int32 */
  orgId?: number
}

export type CurrencytypesUpdatePayload = CurrencyTypeDto[]

export interface CurrencytypesUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type CurrencytypesDeletePayload = number[]

export interface CurrencytypesDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface CurrencytypesDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
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
}

export interface DiscountsCreateParams {
  /** @format int32 */
  orgId?: number
}

export type DiscountsUpdatePayload = DiscountDto[]

export interface DiscountsUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type DiscountsDeletePayload = number[]

export interface DiscountsDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface DiscountsDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface DiscountdetailsListParams {
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

export interface DiscountdetailsCreateParams {
  /** @format int32 */
  orgId?: number
}

export type DiscountdetailsUpdatePayload = DiscountDetailDto[]

export interface DiscountdetailsUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type DiscountdetailsDeletePayload = number[]

export interface DiscountdetailsDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface DiscountdetailsDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface DiscounttypesListParams {
  /** @format int32 */
  orgId?: number
  search?: string
  orderBy?: string
}

export interface DiscounttypesCreateParams {
  /** @format int32 */
  orgId?: number
}

export type DiscounttypesUpdatePayload = DiscountTypeDto[]

export interface DiscounttypesUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type DiscounttypesDeletePayload = number[]

export interface DiscounttypesDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface DiscounttypesDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface CateglistListParams {
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
}

export interface CateglistCreateParams {
  /** @format int32 */
  orgId?: number
}

export type CateglistUpdatePayload = MenuGroupDto[]

export interface CateglistUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type CateglistDeletePayload = number[]

export interface CateglistDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface CateglistDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface GuestTypesListParams {
  /** @format int32 */
  orgId?: number
  search?: string
  status?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
}

export interface MenuitemsListParams {
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
}

export interface MenugroupsListParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  modiGroupType?: number
  search?: string
  orderBy?: string
  status?: Status[]
}

export interface MenuitemsCreateParams {
  /** @format int32 */
  orgId?: number
}

export type MenuitemsUpdatePayload = MenuItemDto[]

export interface MenuitemsUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type MenuitemsDeletePayload = number[]

export interface MenuitemsDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface MenuitemsDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface ModifiersListParams {
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
}

export interface ModifiersCreateParams {
  /** @format int32 */
  orgId?: number
}

export type ModifiersUpdatePayload = ModifierDto[]

export interface ModifiersUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type ModifiersDeletePayload = number[]

export interface ModifiersDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface ModifiersDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface ModigroupsListParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  modiGroupType?: number
  status?: Status[]
  search?: string
  orderBy?: string
}

export interface ModigroupsCreateParams {
  /** @format int32 */
  orgId?: number
}

export type ModigroupsUpdatePayload = ModiGroupDto[]

export interface ModigroupsUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type ModigroupsDeletePayload = number[]

export interface ModigroupsDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface ModigroupsDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface ModischemesListParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  modiSchemeType?: number
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
}

export interface ModischemesCreateParams {
  /** @format int32 */
  orgId?: number
}

export type ModischemesUpdatePayload = ModiSchemeDto[]

export interface ModischemesUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type ModischemesDeletePayload = number[]

export interface ModischemesDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface ModischemesDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface ModischemedetailsDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  modiSchemeId: number
}

export interface ModischemedetailsCreateParams {
  /** @format int32 */
  orgId?: number
}

export type ModischemedetailsUpdatePayload = ModiSchemeDetailDto[]

export interface ModischemedetailsUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type ModischemedetailsDeletePayload = number[]

export interface ModischemedetailsDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface OrganizationsListParams {
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
}

export interface PricetypesListParams {
  /** @format int32 */
  orgId?: number
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
}

export interface PricetypesCreateParams {
  /** @format int32 */
  orgId?: number
}

export type PricetypesUpdatePayload = PriceTypeDto[]

export interface PricetypesUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type PricetypesDeletePayload = number[]

export interface PricetypesDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface PricetypesDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface RateclassesListParams {
  /** @format int32 */
  orgId?: number
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
}

export interface RateclassesCreateParams {
  /** @format int32 */
  orgId?: number
}

export type RateclassesUpdatePayload = RateClassDto[]

export interface RateclassesUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type RateclassesDeletePayload = number[]

export interface RateclassesDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface RateclassesDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface RegionsListParams {
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

export interface RegionsCreateParams {
  /** @format int32 */
  orgId?: number
}

export type RegionsUpdatePayload = RegionDto[]

export interface RegionsUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type RegionsDeletePayload = number[]

export interface RegionsDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface RegionsDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface RestaurantsListParams {
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

export interface RestaurantsCreateParams {
  /** @format int32 */
  orgId?: number
}

export type RestaurantsUpdatePayload = RestaurantDto[]

export interface RestaurantsUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type RestaurantsDeletePayload = number[]

export interface RestaurantsDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface RestaurantsDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface RestaurantsCashgroupsListParams {
  /** @format int32 */
  orgId?: number
}

export interface RestaurantsRolesListParams {
  /** @format int32 */
  orgId?: number
}

export interface RolesListParams {
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
}

export interface RolesCreateParams {
  /** @format int32 */
  orgId?: number
}

export type RolesUpdatePayload = RoleDto[]

export interface RolesUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type RolesDeletePayload = number[]

export interface RolesDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface RolesDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface TaxesTaxesListParams {
  /** @format int32 */
  orgId?: number
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
}

export interface TaxesTaxRatesListParams {
  /** @format int32 */
  orgId?: number
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
}

export interface TaxdishtypesListParams {
  /** @format int32 */
  orgId?: number
  search?: string

  /** @format int32 */
  offset?: number

  /** @format int32 */
  limit?: number
  orderBy?: string
}

export interface TaxdishtypesCreateParams {
  /** @format int32 */
  orgId?: number
}

export type TaxdishtypesUpdatePayload = TaxGroupDto[]

export interface TaxdishtypesUpdateParams {
  /** @format int32 */
  orgId?: number
}

export type TaxdishtypesDeletePayload = number[]

export interface TaxdishtypesDeleteParams {
  /** @format int32 */
  orgId?: number
}

export interface TaxdishtypesDetailParams {
  /** @format int32 */
  orgId?: number

  /** @format int32 */
  id: number
}

export interface RevenuebydaysListParams {
  /** @format int32 */
  orgId?: number

  /** @format $date-time */
  end_date: string
  start_date: string

  /** @format int32 */
  orderBy?: string

  /** @format int32 */
  region: number[]
  concept: number[]
  restaurant: number[]
}

export interface RevenuebyDiscountsListParams {
  /** @format int32 */
  orgId?: number

  /** @format $date-time */
  end_date: string
  start_date: string

  /** @format int32 */
  orderBy?: string

  /** @format int32 */
  region: number[]
  concept: number[]
  restaurant: number[]
}

export interface RevenuebyrestaurantsListParams {
  /** @format int32 */
  orgId?: number

  /** @format $date-time */
  end_date: string
  start_date: string

  /** @format int32 */
  orderBy?: string

  /** @format int32 */
  region: number[]
  concept: number[]
  restaurant: number[]
}
//HourlySale Report by period 1hour
export interface HourlySaleByRestaurantsListParams {
  /** @format int32 */
  orgId?: number

  /** @format $date-time */
  end_date: string
  start_date: string

  /** @format int32 */
  orderBy?: string

  /** @format int32 */
  region: number[]
  concept: number[]
  restaurant: number[]
}

export interface RevenueByEmployeesListParams {
  /** @format int32 */
  orgId?: number

  /** @format $date-time */
  end_date: string
  start_date: string

  /** @format int32 */
  orderBy?: string

  /** @format int32 */
  region: number[]
  concept: number[]
  restaurant: number[]
}
