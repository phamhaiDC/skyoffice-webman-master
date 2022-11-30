import { DefaultOptionType } from 'antd/lib/select'

type FilterType = 'text' | 'number' | 'select' | 'date' | 'dateRange'

interface BaseFilterProps {
  label: string
  type: FilterType
  loading?: boolean
  placeholder?: string
  options?: any[]
}
export interface FilterInputProps extends BaseFilterProps {
  type: 'text' | 'number'
}
export interface FilterSelectProps extends BaseFilterProps {
  type: 'select'
  options: DefaultOptionType[]
}

export interface FilterDateProps extends BaseFilterProps {
  type: 'date'
}

export interface FilterDateRangeProps
  extends Omit<BaseFilterProps, 'placeholder'> {
  type: 'dateRange'
  placeholder?: [string, string]
}

export type FilterItem =
  | FilterInputProps
  | FilterSelectProps
  | FilterDateProps
  | FilterDateRangeProps

export type FilterDef<Model> = Partial<{
  [Property in keyof Model]: FilterItem
}>

export type FilterValue<Model> = Partial<{
  [Property in keyof Model]: any
}>
