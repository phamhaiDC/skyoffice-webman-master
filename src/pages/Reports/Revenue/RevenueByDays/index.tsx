import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { ConfigProvider, message } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import {
  type RevenueByDays as RevenueByDaysModel,
  Concept,
  Region,
  Restaurant,
} from 'models'
import moment from 'moment'
import {
  useGetConceptsQuery,
  useGetRegionsQuery,
  useGetRestaurantsQuery,
  useGetRevenuebydaysQuery,
} from '@apis'
import Filters from '@components/composites/Filters'
import PageTitle from '@components/elements/Title'
import TableHeader from '@components/ListViewHeader'
import useDynamicFilter from '@hooks/useDynamicFilters'
import useFilter, { Sorter } from '@hooks/useFilter'
import actionColumns from '@utils/columns'
import { AddIcon } from '../../../../assets/icons/Add'
import Table from '../../../../components/composites/Table'
import NoData from '../../../../components/elements/NoData'
import { useDeepMemo } from '../../../../hooks/useDeepMemo'
import usePagination from '../../../../hooks/usePagination'
import useWhyDidYouUpdate from '../../../../hooks/useWhyDidYouUpdate'
import { PageContent } from '../../../../layout'
import Scrollable from '../../../../layout/Scrollable'
import { useTablesStore } from '../../../../store'

type FilterModel = {
  region: Region
  concept: Concept
  restaurant: Restaurant
  dateRange: [Date, Date]
}

const RevenueByDays = () => {
  const { t } = useTranslation()
  const { values, setValue } = useDynamicFilter<FilterModel>('filter')
  const columns = useTablesStore(store => store.revenueByDays.columns)
  const pagination = usePagination()
  const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })
  const dateRangeFilter = values.find(v => v.property === 'dateRange')
  const {
    value: [startDate, endDate],
  }: { value: [string, string] } = dateRangeFilter || { value: ['', ''] }
  const regionFilter = values.find(v => v.property === 'region')
  const conceptFilter = values.find(v => v.property === 'concept')
  const restaurantFilter = values.find(v => v.property === 'restaurant')
  const queryClient = useQueryClient()

  useEffect(() => {
    return () => {
      queryClient.cancelQueries(['revenueByDays'])
    }
  }, [])
  const {
    data: revenueByDaysResponse,
    isFetching,
    isLoading,
  } = useGetRevenuebydaysQuery(
    {
      start_date: moment(startDate).format('YYYY-MM-DD'),
      end_date: moment(endDate).format('YYYY-MM-DD'),
      region: regionFilter?.value,
      concept: conceptFilter?.value,
      restaurant: restaurantFilter?.value,
      // orderBy: filter.sortBy,
    },
    {
      onSuccess: response => pagination.setTotal(response.total),
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { data: regionResponse, isFetching: isFetchingRegions } =
    useGetRegionsQuery(
      {},
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )
  const { data: conceptResponse, isFetching: isFetchingConcepts } =
    useGetConceptsQuery(
      {},
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )
  const { data: restaurantResponse, isFetching: isFetchingRestaurants } =
    useGetRestaurantsQuery(
      {},
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )

  const viewDetail = useCallback(() => {}, [])

  const handleDeleteConcepts = async () => {}

  const deleteOne = async () => {}

  const onSorterChange = (
    sorter:
      | SorterResult<RevenueByDaysModel>[]
      | SorterResult<RevenueByDaysModel>
  ) => {
    if (Array.isArray(sorter)) {
      const sorterObj = sorter.reduce<Sorter>(
        (obj, curr) => ({
          ...obj,
          [curr.field as string]: ['ascend', 'descend'].includes(
            curr.order as string
          )
            ? curr.order!
            : 'none',
        }),
        {}
      )
      return filter.setSorter(sorterObj)
    }
    return filter.setSorter({
      [sorter.field as string]: ['ascend', 'descend'].includes(
        sorter.order as string
      )
        ? sorter.order!
        : 'none',
    })
  }

  const originalColumns = useMemo(
    () => [
      {
        title: t('dashboard.report.column.shiftDate'),
        dataIndex: 'shift_date',
        sorter: {
          multiple: 3,
        },
        render: (shift_date: string) => (
          <span>{moment(shift_date).format('DD/MM/YYYY')}</span>
        ),
      },
      {
        title: t('dashboard.report.column.checkCount'),
        dataIndex: 'check_count',
        align: 'center',
        sorter: {
          multiple: 2,
        },
      },
      {
        title: t('dashboard.report.column.guestCount'),
        dataIndex: 'guest_count',
        align: 'center',
        sorter: {
          multiple: 2,
        },
      },
      {
        title: t('dashboard.report.column.amountBeforeTax'),
        dataIndex: 'amount_before_tax',
        align: 'right',
        sorter: {
          multiple: 2,
        },
        render: (amount: number) => new Intl.NumberFormat().format(amount),
      },
      {
        title: t('dashboard.report.column.discountSum'),
        dataIndex: 'discount_sum',
        align: 'right',
        sorter: {
          multiple: 2,
        },
        width: '10%',
        render: (discount_sum: number) =>
          new Intl.NumberFormat().format(discount_sum),
      },
      {
        title: t('dashboard.report.column.serviceCharge'),
        dataIndex: 'services_charge',
        align: 'right',
        sorter: {
          multiple: 0,
        },
        width: '10%',
      },
      {
        title: t('dashboard.report.column.priceSum'),
        dataIndex: 'price_sum',
        align: 'right',
        sorter: {
          multiple: 2,
        },
        render: (price_sum: number) =>
          new Intl.NumberFormat().format(price_sum),
      },
      {
        title: t('dashboard.report.column.taxSum'),
        dataIndex: 'tax_sum',
        align: 'right',
        sorter: {
          multiple: 1,
        },
        render: (tax_sum: number) => new Intl.NumberFormat().format(tax_sum),
      },
      {
        title: t('dashboard.report.column.paySum'),
        dataIndex: 'pay_sum',
        align: 'right',
        sorter: {
          multiple: 2,
        },
        render: (tax_sum: number) => new Intl.NumberFormat().format(tax_sum),
      },
    ],
    [t]
  )

  const visibleColumns = useDeepMemo(() => {
    return originalColumns.filter(item => {
      const a = columns[item.dataIndex as keyof RevenueByDaysModel]
      return a?.fixed || a?.checked
    })
  }, [columns])

  useWhyDidYouUpdate('revenueByDays', { columns, visibleColumns })

  return (
    <PageContent>
      <PageTitle label={t('sideBar.revenue.revenueByDays')} />
      <Filters<FilterModel>
        filters={{
          region: {
            label: t('region.region'),
            type: 'select',
            loading: isFetchingRegions,
            options:
              regionResponse?.regions.map(item => ({
                value: item.id,
                label: item.name,
              })) || [],
            placeholder: t('region.selectRegion'),
          },
          concept: {
            label: t('concept.concept'),
            type: 'select',
            loading: isFetchingConcepts,
            options:
              conceptResponse?.concepts.map(item => ({
                value: item.id,
                label: item.name,
              })) || [],
            placeholder: t('concept.selectConcept'),
          },
          restaurant: {
            label: t('restaurant.restaurant'),
            type: 'select',
            loading: isFetchingRestaurants,
            options:
              restaurantResponse?.restaurants.map(item => ({
                value: item.id,
                label: item.name,
              })) || [],
            placeholder: t('restaurant.selectRestaurant'),
          },
          dateRange: {
            label: t('common.field.dateRange'),
            type: 'dateRange',
          },
        }}
        values={values}
        setValue={setValue}
      />
      <TableHeader<RevenueByDaysModel>
        showDelete={false}
        isDeleting={false}
        hideFilter
        onDelete={handleDeleteConcepts}
        screenName="revenueByDays"
      />
      <Scrollable className="!px-0">
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isFetching} />}
        >
          <Table<RevenueByDaysModel>
            columns={actionColumns(
              viewDetail,
              deleteOne,
              '',
              filter,
              visibleColumns,
              t
            )}
            dataSource={revenueByDaysResponse?.details.map(item => ({
              ...item,
              key: item.restaurant_id,
            }))}
            loading={isLoading || isFetching}
            pagination={false}
            onChange={(_, __, sorter) => onSorterChange(sorter)}
          />
        </ConfigProvider>
      </Scrollable>
    </PageContent>
  )
}

export default RevenueByDays
