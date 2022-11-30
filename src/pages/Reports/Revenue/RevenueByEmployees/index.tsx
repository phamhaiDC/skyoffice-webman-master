import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { ConfigProvider, message } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import moment from 'moment'
import PageTitle from '@components/elements/Title'
import TableHeader from '@components/ListViewHeader'
import actionColumns from '@utils/columns'
import {
  useGetConceptsQuery,
  useGetRegionsQuery,
  useGetRestaurantsQuery,
  useGetRevenuebyEmployeesQuery,
} from '../../../../apis'
import Filters from '../../../../components/composites/Filters'
import Table from '../../../../components/composites/Table'
import NoData from '../../../../components/elements/NoData'
import { useDeepMemo } from '../../../../hooks/useDeepMemo'
import useDynamicFilter from '../../../../hooks/useDynamicFilters'
import useFilter, { Sorter } from '../../../../hooks/useFilter'
import usePagination from '../../../../hooks/usePagination'
import useWhyDidYouUpdate from '../../../../hooks/useWhyDidYouUpdate'
import { PageContent } from '../../../../layout'
import Scrollable from '../../../../layout/Scrollable'
import {
  type RevenueByEmployees as RevenueByEmployeesModel,
  Concept,
  Region,
  Restaurant,
} from '../../../../models'
import { useTablesStore } from '../../../../store'

type FilterModel = {
  region: Region
  concept: Concept
  restaurant: Restaurant
  dateRange: [Date, Date]
}
const RevenueByEmployees = () => {
  const { t } = useTranslation()
  const { values, setValue } = useDynamicFilter<FilterModel>('filter')
  const columns = useTablesStore(store => store.revenueByEmployees.columns)
  const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })
  const pagination = usePagination()
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
      queryClient.cancelQueries(['getrevenuebyemployees'])
    }
  }, [])
  const {
    data: RevenueByEmployeesResponse,
    isLoading,
    isFetching,
  } = useGetRevenuebyEmployeesQuery(
    {
      start_date: moment(startDate).format('YYYY-MM-DD'),
      end_date: moment(endDate).format('YYYY-MM-DD'),
      region: regionFilter?.value,
      concept: conceptFilter?.value,
      restaurant: restaurantFilter?.value,
      // orderBy: filter.sortBy,
    },
    {
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
      | SorterResult<RevenueByEmployeesModel>[]
      | SorterResult<RevenueByEmployeesModel>
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
        title: t('dashboard.report.column.employeeName'),
        dataIndex: 'cashier_name',
        align: 'left',
        sorter: {
          multiple: 3,
        },
      },
      {
        title: t('dashboard.report.column.checkCount'),
        dataIndex: 'check_count',
        align: 'right',
        sorter: {
          multiple: 2,
        },
      },
      {
        title: t('dashboard.report.column.priceSum'),
        dataIndex: 'price_sum',
        align: 'right',
        sorter: {
          multiple: 2,
        },
      },
      {
        title: t('dashboard.report.column.paySum'),
        dataIndex: 'pay_sum',
        align: 'right',
        sorter: {
          multiple: 2,
        },
        render: (pay_sum: number) => new Intl.NumberFormat().format(pay_sum),
      },
      {
        title: t('dashboard.report.column.calPercent'),
        dataIndex: 'calc_percent',
        align: 'right',
        sorter: {
          multiple: 2,
        },
        render: (calc_percent: number) =>
          `${new Intl.NumberFormat().format(calc_percent)}%`,
      },
    ],
    [t]
  )

  const visibleColumns = useDeepMemo(() => {
    return originalColumns.filter(item => {
      const a = columns[item.dataIndex as keyof RevenueByEmployeesModel]
      return a?.fixed || a?.checked
    })
  }, [columns])

  useWhyDidYouUpdate('RevenueByEmployees', { columns, visibleColumns })
  return (
    <PageContent>
      <PageTitle label={t('sideBar.revenue.revenueByEmployees')} />
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
      <TableHeader<RevenueByEmployeesModel>
        showDelete={false}
        isDeleting={false}
        hideFilter
        onDelete={handleDeleteConcepts}
        screenName="revenueByEmployees"
      />
      <Scrollable className="!px-0">
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isFetching} />}
        >
          <Table<RevenueByEmployeesModel>
            columns={actionColumns(
              viewDetail,
              deleteOne,
              '',
              filter,
              visibleColumns,
              t
            )}
            dataSource={RevenueByEmployeesResponse?.map(item => ({
              ...item,
              key: item.calc_percent,
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

export default RevenueByEmployees
