import { useEffect, useState } from 'react'
import { ControllerProps, useFormContext } from 'react-hook-form'
import { FormItemProps, Select, SelectProps } from 'antd'
import { PaginationInfo } from '@hooks/usePagination'
import { filterDuplicateItems } from '../../utils/array'
import { FadedText } from '../modals/Layout'
import { ControlledFormItem } from './ControlledFormItem'

export type SelectOption = Omit<
  React.ComponentProps<typeof Select.Option>,
  'id'
> & {
  label: string
  description?: string
}

type Props = {
  name: string
  options: SelectOption[]
  label?: string
  formItemProps?: FormItemProps
  className?: string
  selectProps?: SelectProps
  pagination?: PaginationInfo
  totalItem?: number
  searchItems?: (search: string) => void
  showDescription?: boolean
} & Omit<ControllerProps, 'render'>

const FormSelect: React.FC<Props> = ({
  pagination,
  selectProps,
  totalItem,
  options,
  showDescription,
  ...rest
}) => {
  const { watch } = useFormContext()
  const value = watch(rest.name)
  const [description, setDescription] = useState<string>()

  useEffect(() => {
    const filtereds = options.filter(item => item.value === value)
    if (filtereds.length) {
      setDescription(filtereds[0]?.description)
    }
  }, [value])

  return (
    <ControlledFormItem
      {...rest}
      render={({ onChange, onBlur }) => (
        <div className="flex flex-col">
          <Select
            allowClear
            {...selectProps}
            {...{
              value,
              onChange,
              onBlur,
            }}
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
          >
            {filterDuplicateItems(options, 'value').map(option => (
              <Select.Option
                value={option.value}
                key={option.value}
                {...option}
              >
                <span className="text-gray-800">{option.label}</span>
              </Select.Option>
            ))}
          </Select>
          {showDescription && (
            <FadedText className="mt-1">{description}</FadedText>
          )}
        </div>
      )}
    />
  )
}

export default FormSelect

// import { useState } from 'react'
// import { ControllerProps } from 'react-hook-form'
// import { FormItemProps, Select, SelectProps } from 'antd'
// import { PaginationInfo } from '@hooks/usePagination'
// import { filterDuplicateItems } from '../../utils/array'
// import { ControlledFormItem } from './ControlledFormItem'

// type SelectOption = Omit<React.ComponentProps<typeof Select.Option>, 'id'> & {
//   label: string
//   description?: string
// }

// type Props = {
//   name: string
//   options: SelectOption[]
//   label?: string
//   formItemProps?: FormItemProps
//   className?: string
//   selectProps?: SelectProps
//   pagination?: PaginationInfo
//   totalItem?: number
//   searchItems?: (search: string) => void
// } & Omit<ControllerProps, 'render'>

// const FormSelect: React.FC<Props> = ({
//   pagination,
//   selectProps,
//   totalItem,
//   options,
//   ...rest
// }) => {
//   const [extra, setExtra] = useState<string>()

//   return (
//     <ControlledFormItem
//       {...rest}
//       formItemProps={{
//         ...rest.formItemProps,
//         extra,
//       }}
//       render={({ value, onChange, onBlur }) => (
//         <Select
//           {...{
//             value,
//             onChange: (_, option: any) => {
//               onChange()
//               setExtra(option?.description)
//             },
//             onBlur,
//           }}
//           {...selectProps}
//           onPopupScroll={
//             pagination
//               ? e => {
//                   const target = e.target as HTMLSelectElement
//                   if (
//                     target.scrollTop + target.offsetHeight ===
//                       target.scrollHeight &&
//                     totalItem &&
//                     pagination.offset < totalItem
//                   ) {
//                     pagination.setOffset(pagination.offset + pagination.limit)
//                   }
//                 }
//               : undefined
//           }
//         >
//           {filterDuplicateItems(options, 'value').map(option => (
//             <Select.Option value={option.value} key={option.value} {...option}>
//               <span className="text-gray-800">{option.label}</span>
//             </Select.Option>
//           ))}
//         </Select>
//       )}
//     />
//   )
// }

// export default FormSelect
