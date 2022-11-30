import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { ConfigProvider, message, Table } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import { type Concept as ConceptModel } from 'models'
import {
  useDeleteConceptsMutation,
  useGetConceptsQuery,
  useGetRegionsQuery,
  useGetRestaurantsQuery,
} from '@apis'
import { ReactComponent as ConceptIcon } from '@assets/icons/ConceptIcon.svg'
import Filters from '@components/composites/Filters'
import PageTitle from '@components/elements/Title'
import TableHeader from '@components/ListViewHeader'
import useDynamicFilter from '@hooks/useDynamicFilters'
import { Concept, Region, Restaurant } from '@models'
import actionColumns from '@utils/columns'
import { AddIcon } from '../../../../assets/icons/Add'
import { ActionButton } from '../../../../components/elements/ActionButton'
import NoData from '../../../../components/elements/NoData'
import StatusTag from '../../../../components/elements/StatusTag'
import Pagination from '../../../../components/Pagination'
import { useDeepMemo } from '../../../../hooks/useDeepMemo'
import useFilter, { Sorter } from '../../../../hooks/useFilter'
import usePagination from '../../../../hooks/usePagination'
import useWhyDidYouUpdate from '../../../../hooks/useWhyDidYouUpdate'
import { PageContent } from '../../../../layout'
import Scrollable from '../../../../layout/Scrollable'
import { Status } from '../../../../models/swagger'
import { useTablesStore } from '../../../../store'

type FilterModel = {
  region: Region
  concept: Concept
  restaurant: Restaurant
  name: string
  date: Date
  dateRange: [Date, Date]
}

const SalesSummary = () => {
  const { t } = useTranslation()
  // const queryClient = useQueryClient()
  // const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  // const [detailVisible, setDetailVisile] = useState(false)

  // const [selectedConceptId, setSelectedConceptId] = useState<
  //   number | undefined
  // >(undefined)
  // const columns = useTablesStore(store => store.concept.columns)
  // const showCreateForm = () => {
  //   setSelectedConceptId(undefined)
  // }
  const queryClient = useQueryClient()

  useEffect(() => {
    return () => {
      queryClient.cancelQueries(['getRegions'])
    }
  }, [])
  const { values, setValue } = useDynamicFilter<FilterModel>('filter')
  const { data: regionResponse, isFetching: isFetchingRegions } =
    useGetRegionsQuery(
      {},
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )

  // const pagination = usePagination()
  // const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })

  // const {
  //   // data: conceptResponse,
  //   isLoading,
  //   isFetching,
  // } = useGetConceptsQuery(
  //   {
  //     limit: pagination.limit,
  //     offset: pagination.offset,
  //     search: filter.search,
  //     orderBy: filter.sortBy,
  //     status: filter.status,
  //   },
  //   {
  //     onSuccess: response => pagination.setTotal(response.total),
  //     onError: (e: any) => {
  //       message.error({ content: e.message })
  //     },
  //   }
  // )
  // const { mutateAsync: deleteConcepts, isLoading: isDeleting } =
  //   useDeleteConceptsMutation({
  //     onSuccess: () => {
  //       message.success({
  //         content:
  //           selectedRowKeys.length > 1
  //             ? t('concept.deleteMulti.success')
  //             : t('concept.delete.success'),
  //       })
  //       if (
  //         (pagination.total &&
  //           selectedRowKeys.length === pagination.total % pagination.limit) ||
  //         (selectedRowKeys.length === 0 &&
  //           pagination.offset + 1 === pagination.total)
  //       ) {
  //         pagination.setOffset(
  //           pagination.offset === 0 ? 0 : pagination.offset - pagination.limit
  //         )
  //       }
  //       setSelectedRowKeys([])
  //       queryClient.invalidateQueries('getConcepts')
  //     },
  //     onError: (e: any) => {
  //       message.error({ content: e.message })
  //     },
  //   })

  // const handleDeleteConcepts = async () => {
  //   if (selectedRowKeys) {
  //     await deleteConcepts(selectedRowKeys)
  //   }
  // }
  // const viewDetail = useCallback((id: number) => {
  //   setSelectedConceptId(id)
  //   showDetail()
  // }, [])

  // const deleteOne = async (id: number) => {
  //   await deleteConcepts([id])
  // }
  // useEffect(() => {
  //   setSelectedRowKeys([])
  // }, [])

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
  // const onSorterChange = (
  //   sorter: SorterResult<ConceptModel>[] | SorterResult<ConceptModel>
  // ) => {
  //   if (Array.isArray(sorter)) {
  //     const sorterObj = sorter.reduce<Sorter>(
  //       (obj, curr) => ({
  //         ...obj,
  //         [curr.field as string]: ['ascend', 'descend'].includes(
  //           curr.order as string
  //         )
  //           ? curr.order!
  //           : 'none',
  //       }),
  //       {}
  //     )
  //     return filter.setSorter(sorterObj)
  //   }
  //   return filter.setSorter({
  //     [sorter.field as string]: ['ascend', 'descend'].includes(
  //       sorter.order as string
  //     )
  //       ? sorter.order!
  //       : 'none',
  //   })
  // }
  // const originalColumns = useMemo(
  //   () => [
  //     {
  //       title: t('common.field.id'),
  //       dataIndex: 'id',
  //       width: '10%',
  //     },
  //     {
  //       title: t('common.field.id'),
  //       dataIndex: 'alt_name',
  //       width: '10%',
  //     },
  //     {
  //       title: t('common.field.id'),
  //       dataIndex: '1',
  //       width: '10%',
  //     },
  //     {
  //       title: t('common.field.name'),
  //       dataIndex: 'name',
  //       ellipsis: true,
  //       sorter: {
  //         multiple: 3,
  //       },
  //       render: (name: string, record: ConceptModel) => (
  //         <span
  //           className="text-blue-500 cursor-pointer"
  //           onClick={() => viewDetail(record.id)}
  //         >
  //           {name}
  //         </span>
  //       ),
  //     },
  //     {
  //       title: t('common.field.altName'),
  //       dataIndex: 'altName',
  //       sorter: {
  //         multiple: 1,
  //       },
  //     },
  //     {
  //       title: t('common.field.code'),
  //       dataIndex: 'code',
  //       width: '10%',
  //       sorter: {
  //         multiple: 2,
  //       },
  //     },
  // {
  //   title: t('common.field.status'),
  //   // dataIndex: 'status',
  //   width: '15%',
  //   sorter: {
  //     multiple: 0,
  //   },
  //   // render: (status: Status) => <StatusTag status={status} />,
  // },
  //   ],
  //   [t, viewDetail]
  // )

  // const visibleColumns = useDeepMemo(() => {
  //   return originalColumns.filter(item => {
  //     const a = columns[item.dataIndex as keyof ConceptModel]
  //     return a?.fixed || a?.checked
  //   })
  // }, [columns])

  // useWhyDidYouUpdate('concept', { columns, visibleColumns })

  return (
    <PageContent>
      <PageTitle label={t('sideBar.revenue.salesSummary')} />
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
          // name: {
          //   label: t('common.field.name'),
          //   type: 'text',
          //   placeholder: t('common.field.placeholder.name'),
          // },
          // date: {
          //   label: t('common.field.date'),
          //   type: 'date',
          // },
          dateRange: {
            label: t('common.field.dateRange'),
            type: 'dateRange',
          },
        }}
        values={values}
        setValue={setValue}
      />
      {/* <Scrollable className="!px-0">
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isFetching} />}
        >
          <Table<ConceptModel>
            rowSelection={{
              selectedRowKeys,
              onChange: keys => setSelectedRowKeys(keys as number[]),
            }}
            columns={actionColumns(
              viewDetail,
              deleteOne,
              <ConceptIcon />,
              filter,
              visibleColumns,
              t
            )}
            dataSource={conceptResponse?.concepts.map(item => ({
              ...item,
              key: item.id,
            }))}
            loading={isLoading || isFetching}
            pagination={false}
            onChange={(_, __, sorter) => onSorterChange(sorter)}
          />
        </ConfigProvider>
      </Scrollable>
      {!isLoading && !!conceptResponse?.total && (
        <Pagination
          config={pagination}
          totalItems={{
            total: conceptResponse?.total,
            selected: selectedRowKeys.length,
          }}
        />
      )} */}
    </PageContent>
  )
}

export default SalesSummary
