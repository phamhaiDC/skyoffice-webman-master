import { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import { MenuItemProps } from 'rc-menu'
import { ReactComponent as ClassificationIcon } from '@assets/icons/ClassificationIcon.svg'
import { ReactComponent as ComboIcon } from '@assets/icons/ComboIcon.svg'
import { ReactComponent as ComboSchemeIcon } from '@assets/icons/ComboSchemeIcon.svg'
import { ReactComponent as ConceptIcon } from '@assets/icons/ConceptIcon.svg'
import { ReactComponent as CurrencyIcon } from '@assets/icons/CurrencyIcon.svg'
import { ReactComponent as DiscountIcon } from '@assets/icons/DiscountIcon.svg'
import { ReactComponent as EmployeeIcon } from '@assets/icons/EmployeeIcon.svg'
import { ReactComponent as MenuItemIcon } from '@assets/icons/MenuItemIcon.svg'
import { ReactComponent as ModifierIcon } from '@assets/icons/ModifierIcon.svg'
import { ReactComponent as ModifierSchemeIcon } from '@assets/icons/ModifierSchemeIcon.svg'
import { ReactComponent as PosIcon } from '@assets/icons/PosIcon.svg'
import { ReactComponent as PriceTypeIcon } from '@assets/icons/PriceTypeIcon.svg'
import { ReactComponent as RegionIcon } from '@assets/icons/RegionIcon.svg'
import { ReactComponent as RestaurantIcon } from '@assets/icons/RestaurantIcon.svg'
import { ReactComponent as TaxGroupIcon } from '@assets/icons/TaxGroupIcon.svg'

type Item = MenuItemProps & {
  label: string
  key: string
  icon?: ReactElement
}

export type MainRoute = 'menu' | 'finance' | 'administration'

type Pages = {
  [key in MainRoute]: { [key: string]: Item }
}

export const MASTER_DATA_PAGES = (t: TFunction): Pages => ({
  menu: {
    'menu-groups': {
      key: 'menu-groups',
      label: t('sideBar.menu.menuItems'),
      icon: <MenuItemIcon />,
    },
    'modi-groups': {
      key: 'modi-groups',
      label: t('sideBar.menu.modifiers'),
      icon: <ModifierIcon />,
    },
    'modifier-schemes': {
      key: 'modifier-schemes',
      label: t('sideBar.menu.modifierSchemes'),
      icon: <ModifierSchemeIcon />,
    },
    'combo-groups': {
      key: 'combo-groups',
      label: t('sideBar.menu.combos'),
      icon: <ComboIcon />,
    },
    'combo-schemes': {
      key: 'combo-schemes',
      label: t('sideBar.menu.comboSchemes'),
      icon: <ComboSchemeIcon />,
    },
    'classification-groups': {
      key: 'classification-groups',
      label: t('sideBar.menu.classifications'),
      icon: <ClassificationIcon />,
    },
  },
  finance: {
    'discount-types': {
      key: 'discount-types',
      label: t('sideBar.finance.discounts'),
      icon: <DiscountIcon />,
    },
    'price-types': {
      key: 'price-types',
      label: t('sideBar.finance.priceTypes'),
      icon: <PriceTypeIcon />,
    },
    'tax-groups': {
      key: 'tax-groups',
      label: t('sideBar.finance.taxGroups'),
      icon: <TaxGroupIcon />,
    },
    'currency-types': {
      key: 'currency-types',
      label: t('sideBar.finance.currencies'),
      icon: <CurrencyIcon />,
    },
  },
  administration: {
    regions: {
      key: 'regions',
      label: t('sideBar.administration.regions'),
      icon: <RegionIcon />,
    },
    concepts: {
      key: 'concepts',
      label: t('sideBar.administration.concepts'),
      icon: <ConceptIcon />,
    },
    restaurants: {
      key: 'restaurants',
      label: t('sideBar.administration.restaurants'),
      icon: <RestaurantIcon />,
    },
    'cash-groups': {
      key: 'cash-groups',
      label: t('sideBar.administration.pos'),
      icon: <PosIcon />,
    },
    'group-roles': {
      key: 'group-roles',
      label: t('sideBar.administration.employees'),
      icon: <EmployeeIcon />,
    },
  },
})

export type MainReportRoute = 'revenue' | 'finance' | 'customer'

type ReportPages = {
  [key in MainReportRoute]: { [key: string]: Item }
}

export const REPORT_PAGES = (t: TFunction): ReportPages => ({
  revenue: {
    'sales-summary': {
      key: 'sales-summary',
      label: t('sideBar.revenue.salesSummary'),
      icon: <MenuItemIcon />,
    },
    'revenue-by-days': {
      key: 'revenue-by-days',
      label: t('sideBar.revenue.revenueByDays'),
      icon: <ModifierIcon />,
    },
    'revenue-by-restaurants': {
      key: 'revenue-by-restaurants',
      label: t('sideBar.revenue.revenueByRestaurants'),
      icon: <RegionIcon />,
    },
    'list-of-receipts': {
      key: 'list-of-receipts',
      label: t('sideBar.revenue.listOfReceipts'),
      icon: <DiscountIcon />,
    },
    'revenue-by-employees': {
      key: 'revenue-by-employees',
      label: t('sideBar.revenue.revenueByEmployees'),
      icon: <EmployeeIcon />,
    },
    'sales-by-dishes': {
      key: 'sales-by-dishes',
      label: t('sideBar.revenue.salesByDishes'),
      icon: <DiscountIcon />,
    },
    'sales-by-categories': {
      key: 'sales-by-categories',
      label: t('sideBar.revenue.salesByCategories'),
      icon: <TaxGroupIcon />,
    },
  },
  finance: {
    discounts: {
      key: 'discounts',
      label: t('sideBar.finance.discounts'),
      icon: <DiscountIcon />,
    },
    tax: {
      key: 'tax',
      label: t('sideBar.finance.tax'),
      icon: <TaxGroupIcon />,
    },
    HoursReports: {
      key: 'HoursReports',
      label: t('sideBar.finance.HoursReports'),
      icon: <TaxGroupIcon />,
    },
  },
  customer: {
    customers: {
      key: 'customers',
      label: t('sideBar.customer.customers'),
      icon: <RegionIcon />,
    },
    'revenue-by-group': {
      key: 'revenue-by-group',
      label: t('sideBar.customer.revenueByGroup'),
      icon: <ConceptIcon />,
    },
  },
})
