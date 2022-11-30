import { forwardRef } from 'react'
import { Select } from 'antd'
import { BaseSelectRef } from 'rc-select'
import { FilterSelectProps } from './types'

const FilterSelect = forwardRef<BaseSelectRef, FilterSelectProps>(
  (props, ref) => {
    return <Select ref={ref} {...props} />
  }
)

export default FilterSelect
