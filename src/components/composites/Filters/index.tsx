import { PropsWithChildren, useMemo, useState } from 'react'
import { Path } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button, DatePicker, Popover, PopoverProps, Radio } from 'antd'
import moment from 'moment'
import styled from 'styled-components'
import tw from 'twin.macro'
import Icon from '@ant-design/icons'
import { DATE_FORMAT } from '@utils/constant'
import {
  FilterValue,
  useDynamicFiltersStore,
} from '../../../store/dynamicFilters'
import AddFilter from './AddFilter'
import { FilterDef, FilterItem } from './types'
import ValueTag from './ValueTag'

type Props<Model> = {
  filters: FilterDef<Model>
  values: FilterValue[]
  setValue: (property: Path<Partial<Model>>, value: any, index?: number) => void
}

type DateFilterType = 'today' | 'thisWeek' | 'thisMonth' | 'thisYear'

const getMonday = (today = new Date()) => {
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(today.setDate(diff))
}

const getDateRange = (dateFilter?: DateFilterType) => {
  const from = new Date()
  const to = new Date()
  switch (dateFilter) {
    case 'today':
      return [moment(from), moment(to)]
    case 'thisWeek':
      return [moment(getMonday()), moment(to)]
    case 'thisMonth': {
      const startOfMonth = new Date(from.setDate(1))
      return [moment(startOfMonth), moment(to)]
    }
    case 'thisYear': {
      const startOfYear = new Date(new Date(from.setDate(1)).setMonth(0))
      return [moment(startOfYear), moment(to)]
    }
    default:
      return [moment(from), moment(to)]
  }
}

const getDateFilterType = (
  dateRange?: [moment.Moment, moment.Moment]
): DateFilterType | undefined => {
  if (!dateRange) return undefined
  const [from, to] = dateRange
  const currentDate = new Date()
  // check to is equal current date or not
  if (!to.isSame(moment(currentDate), 'day')) return undefined
  // today
  if (from.isSame(to, 'day')) return 'today'
  // check from is equal start of week or not
  const monday = getMonday()
  if (from.isSame(moment(monday), 'day')) return 'thisWeek'
  // check from is start of month or not
  const startOfMonth = new Date(new Date().setDate(1))
  if (from.isSame(moment(startOfMonth), 'day')) return 'thisMonth'
  // check from is start of year or not
  const startOfYear = new Date(new Date(new Date().setDate(1)).setMonth(0))
  if (from.isSame(moment(startOfYear), 'day')) return 'thisYear'
  return undefined
}

const onDatePickerChange = (_dateRange: [moment.Moment, moment.Moment]) => {}

const Filters = <Model,>({ filters, values, setValue }: Props<Model>) => {
  const { t } = useTranslation()
  const [isAdding, setAdding] = useState(false)

  const [dateFilterType, setDateFilterType] = useState<
    DateFilterType | undefined
  >(
    getDateFilterType(
      values[0].value
        ? [moment(values[0].value[0]), moment(values[0].value[1])]
        : undefined
    )
  )

  const onChangeDateFilterType = (_dateFilterType: DateFilterType) => {
    setDateFilterType(_dateFilterType)
    setValue(
      'dateRange' as Path<Partial<Model>>,
      getDateRange(_dateFilterType),
      0
    )
  }

  const tags = useMemo(
    () =>
      values.filter(
        (item, index) =>
          index !== 0 && item.value !== undefined && item.value.length > 0
      ),
    [values]
  )

  const unselectedFilters = useMemo(
    () =>
      Object.entries(filters as { [key: string]: FilterItem }).reduce(
        (pre, curr) =>
          values
            .filter(
              item =>
                item.value &&
                (item.value as unknown as number[]).length > 0 &&
                (item.value as unknown as string).toString().trim() !== ''
            )
            .map(item => item.property)
            .includes(curr[0])
            ? pre
            : {
                ...pre,
                [curr[0]]: curr[1],
              },
        {}
      ),
    [filters, values]
  )

  const isLoading = useMemo(
    () => Object.values(filters).some((v: any) => v.loading),
    [filters]
  )

  return (
    <Container>
      <div className="flex gap-x-4 gap-y-2 flex-wrap mb-4">
        <StyledRadioGroup
          value={dateFilterType}
          onChange={e => onChangeDateFilterType(e.target.value)}
        >
          <Radio.Button value="today">
            {t('dashboard.filter.time.today')}
          </Radio.Button>
          <Radio.Button value="thisWeek">
            {t('dashboard.filter.time.thisWeek')}
          </Radio.Button>
          <Radio.Button value="thisMonth">
            {t('dashboard.filter.time.thisMonth')}
          </Radio.Button>
          <Radio.Button value="thisYear">
            {t('dashboard.filter.time.thisYear')}
          </Radio.Button>
        </StyledRadioGroup>
        <StyledRangePicker
          onChange={(e: any) => {
            setValue('dateRange' as Path<Partial<Model>>, e, 0)
          }}
          allowClear={false}
          format={DATE_FORMAT}
          placeholder={[
            t('common.field.placeholder.dateRange.from'),
            t('common.field.placeholder.dateRange.to'),
          ]}
          size="large"
          value={
            (values as any)[0]
              ? [
                  moment((values as any)[0].value[0]),
                  moment((values as any)[0].value[1]),
                ]
              : undefined
          }
        />
        {!isLoading &&
          tags.map((tag, index) => (
            <ValueTag<Model>
              filters={filters}
              unsetFilters={unselectedFilters}
              filterValue={{ ...tag, index: index + 1 }}
              setValue={setValue}
            />
          ))}
        {Object.keys(unselectedFilters).length > 0 && (
          <StyledPopover
            placement="bottom"
            visible={isAdding}
            onVisibleChange={setAdding}
            title={t('filters.add')}
            destroyTooltipOnHide
            content={
              <AddFilter
                filters={unselectedFilters}
                onOk={setValue}
                onCancel={() => setAdding(false)}
              />
            }
            trigger="click"
          >
            <Button
              className="rounded-full"
              onClick={() => setAdding(true)}
              type="primary"
              icon={<Icon component={FilterIcon} />}
              loading={isLoading}
            >
              {t('filters.add')}
            </Button>
          </StyledPopover>
        )}
      </div>
    </Container>
  )
}

export default Filters

const Container = styled.div.attrs({ className: 'px-8' })``

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

const FilterIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.6666 2H1.33331L6.66665 8.30667V12.6667L9.33331 14V8.30667L14.6666 2Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const StyledPopover = styled(CustomPopover)`
  .ant-popover-title {
    ${tw`!text-base`}
  }
`

const StyledRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper:first-child {
    ${tw`rounded-l-[4px]`}
  }

  .ant-radio-button-wrapper:last-child {
    ${tw`rounded-r-[4px]`}
  }
`

const StyledRangePicker = styled(DatePicker.RangePicker)`
  ${tw`rounded-full border-gray-200 cursor-pointer`}

  .ant-picker-suffix {
    ${tw`ml-[3px] `}
  }

  .ant-picker-input {
    input {
      ${tw`w-[4rem] font-semibold text-gray-800 text-xs cursor-pointer`}
    }
  }

  .ant-picker-separator {
    ${tw`cursor-pointer`}
  }
`
