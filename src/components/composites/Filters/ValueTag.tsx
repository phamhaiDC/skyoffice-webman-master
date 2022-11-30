import { PropsWithChildren, useState } from 'react'
import { Path } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Popover, PopoverProps, Tag, Typography } from 'antd'
import { DefaultOptionType } from 'antd/lib/select'
import moment from 'moment'
import styled from 'styled-components'
import tw from 'twin.macro'
import { DATE_FORMAT } from '@utils/constant'
import AddFilter from './AddFilter'
import { FilterDef, FilterItem } from './types'

const getValueByType = (value: any, filterItem?: FilterItem) => {
  const type = filterItem?.type

  switch (type) {
    case 'select': {
      const filtered = filterItem?.options.filter(item =>
        value.includes(item.value)
      )
      return filtered?.map(item => item.label)
    }
    case 'dateRange': {
      const [from, to] = value
      return `${moment(from).format(DATE_FORMAT)} -> ${moment(to).format(
        DATE_FORMAT
      )}`
    }
    default:
      return value
  }
}

type TagProps<Model> = {
  filters: FilterDef<Model>
  unsetFilters: FilterDef<Model>
  filterValue: {
    index: number
    property: Path<Partial<Model>>
    value: any
  }
  setValue: (property: Path<Partial<Model>>, value: any, index?: number) => void
}

const ValueTag = <Model,>({
  filters,
  unsetFilters,
  filterValue,
  setValue,
}: TagProps<Model>) => {
  const { t } = useTranslation()

  const [isEditing, setEditing] = useState(false)

  const renderSelectValue = (options: DefaultOptionType[], val: number[]) => {
    const filteredOptions = options?.filter(option =>
      val.includes(option.value as number)
    )

    if (!filteredOptions?.length) return undefined

    return (
      <div className="cursor-pointer flex items-center">
        <StyledEllipsis>
          <Typography.Text ellipsis>{filteredOptions[0].label}</Typography.Text>
        </StyledEllipsis>
        <div>
          {filteredOptions.length > 1 ? (
            <>&nbsp;+{filteredOptions.length - 1}</>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }

  const filterItem = filters[filterValue.property as unknown as keyof Model]

  if (
    filterItem?.type === 'dateRange' ||
    (filterItem?.type === 'select' &&
      !(filterValue.value as number[]).length) ||
    (filterItem?.type === 'text' && (filterValue.value as string).trim() === '')
  ) {
    return null
  }

  return (
    <StyledPopover
      trigger="click"
      placement="bottom"
      visible={isEditing}
      title={t('filters.editFilter')}
      onVisibleChange={setEditing}
      destroyTooltipOnHide
      content={
        <AddFilter
          filters={{
            [filterValue.property]: filterItem,

            ...unsetFilters,
          }}
          selectedProperty={filterValue.property}
          selectedValue={filterValue.value}
          onOk={(prop: Path<Partial<Model>>, val: any) => {
            setValue(prop, val, filterValue.index)
          }}
          onCancel={() => setEditing(false)}
        />
      }
    >
      <StyledTag
        key={filterValue.property}
        className="flex items-center gap-1 rounded-full h-8 pl-4 pr-3 m-0 bg-gray-200 border-none cursor-pointer"
        closable
        onClose={() =>
          setValue(filterValue.property, undefined as any, filterValue.index)
        }
      >
        <span className="font-medium text-xs text-gray-500">
          {filterItem?.label}:
        </span>
        <div className="flex items-center font-semibold text-xs text-gray-800">
          {filterItem?.type === 'select' ? (
            renderSelectValue(filterItem.options, filterValue.value)
          ) : (
            <StyledEllipsis>
              <Typography.Text ellipsis>
                {getValueByType(filterValue.value, filterItem)}
              </Typography.Text>
            </StyledEllipsis>
          )}
        </div>
      </StyledTag>
    </StyledPopover>
  )
}

export default ValueTag

const StyledEllipsis = styled(Typography.Text).attrs({
  className: 'max-w-[10rem]',
})``

type CustomPopoverProps = PropsWithChildren<PopoverProps>

const CustomPopover: React.FC<CustomPopoverProps> = ({
  children,
  className,
  ...restProps
}) => (
  <Popover overlayClassName={className} {...restProps}>
    {children}
  </Popover>
)

const StyledPopover = styled(CustomPopover)`
  .ant-popover-title {
    ${tw`!text-base`}
  }
`

const StyledTag = styled(Tag)`
  /* .ant-tag-close-icon {
    :hover {
      ${tw`bg-red-500 text-white`}
    }
  } */
`
