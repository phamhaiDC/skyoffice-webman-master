import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DatePicker, Radio } from 'antd'
import moment from 'moment'
import styled from 'styled-components'
import tw from 'twin.macro'
import { useDashboardFilterStore } from '@store'
import { DATE_FORMAT } from '@utils/constant'

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

export const DateFilter: React.FC = () => {
  const { t } = useTranslation()

  const dateRange = useDashboardFilterStore(state => state.dateRange)

  const setDateRange = useDashboardFilterStore(state => state.setDateRange)
  const [dateFilterType, setDateFilterType] = useState<
    DateFilterType | undefined
  >(
    getDateFilterType(
      dateRange ? [moment(dateRange[0]), moment(dateRange[1])] : undefined
    )
  )

  const onChangeDateFilterType = (_dateFilterType: DateFilterType) => {
    setDateFilterType(_dateFilterType)
    setDateRange(
      getDateRange(_dateFilterType) as [moment.Moment, moment.Moment]
    )
  }

  const onDatePickerChange = (_dateRange: [moment.Moment, moment.Moment]) => {
    setDateRange(_dateRange)
    setDateFilterType(getDateFilterType(_dateRange))
  }

  return (
    <div className="flex gap-4">
      <StyledRadioGroup
        onChange={e => onChangeDateFilterType(e.target.value)}
        value={dateFilterType}
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
        allowClear={false}
        format={DATE_FORMAT}
        placeholder={[
          t('common.field.placeholder.dateRange.from'),
          t('common.field.placeholder.dateRange.to'),
        ]}
        size="large"
        onChange={_dateRange =>
          onDatePickerChange(_dateRange as [moment.Moment, moment.Moment])
        }
        value={
          dateRange ? [moment(dateRange[0]), moment(dateRange[1])] : undefined
        }
      />
    </div>
  )
}

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
