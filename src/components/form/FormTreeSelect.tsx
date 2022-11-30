import { useMemo, useState } from 'react'
import { ControllerProps, useFormContext } from 'react-hook-form'
import { FormItemProps, TreeSelect, TreeSelectProps } from 'antd'
import { DefaultOptionType } from 'rc-tree-select/lib/TreeSelect'
import { PaginationInfo } from '@hooks/usePagination'
import { flatTreeSelectData } from '../../utils/trees'
import { ControlledFormItem } from './ControlledFormItem'

type TreeOption = DefaultOptionType & {
  description?: string
  selectable?: boolean
}

type Props = {
  name: string
  flatOptions: TreeOption[]
  label?: string
  formItemProps?: FormItemProps
  className?: string
  selectProps?: TreeSelectProps
  pagination?: PaginationInfo
  totalItem?: number
  searchItems?: (search: string) => void
} & Omit<ControllerProps, 'render'>

const FormTreeSelect: React.FC<Props> = ({
  pagination,
  selectProps,
  totalItem,
  flatOptions,
  ...rest
}) => {
  const [extra, setExtra] = useState<string>()

  const treeData = useMemo(
    () => flatOptions && flatTreeSelectData(flatOptions || []),
    [flatOptions]
  )
  const { watch } = useFormContext()
  const value = watch(rest.name)

  return (
    <ControlledFormItem
      {...rest}
      formItemProps={{
        ...rest.formItemProps,
        extra,
      }}
      render={({ onChange, onBlur }) => (
        <TreeSelect
          {...{
            value,
            onChange: (_value: number) => {
              onChange(_value)
              setExtra(
                flatOptions.filter(item => item.value === _value)[0]
                  ?.description
              )
            },
            onBlur,
          }}
          {...selectProps}
          onPopupScroll={
            pagination
              ? e => {
                  const target = e.target as HTMLSelectElement
                  if (
                    target.scrollTop + target.offsetHeight ===
                      target.scrollHeight &&
                    totalItem &&
                    pagination.offset < totalItem
                  ) {
                    pagination.setOffset(pagination.offset + pagination.limit)
                  }
                }
              : undefined
          }
          treeData={treeData}
          showSearch
          treeNodeFilterProp="title"
          treeExpandAction="click"
        />
      )}
    />
  )
}

export default FormTreeSelect
