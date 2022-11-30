import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { ConfigProvider, message } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import { type Restaurant as RestaurantModel } from 'models'
import { Status } from 'models/swagger'
import { useDeleteRestaurantsMutation, useGetRestaurantsQuery } from '@apis'
import { AddIcon } from '@assets/icons/Add'
import { ReactComponent as RestaurantIcon } from '@assets/icons/RestaurantIcon.svg'
import Table from '@components/composites/Table'
import { ActionButton } from '@components/elements/ActionButton'
import NoData from '@components/elements/NoData'
import StatusTag from '@components/elements/StatusTag'
import PageTitle from '@components/elements/Title'
import TableHeader from '@components/ListViewHeader'
import Pagination from '@components/Pagination'
import { useDeepMemo } from '@hooks/useDeepMemo'
import useFilter, { Sorter } from '@hooks/useFilter'
import usePagination from '@hooks/usePagination'
import useWhyDidYouUpdate from '@hooks/useWhyDidYouUpdate'
import { PageContent } from '@layout/index'
import { useTablesStore } from '@store'
import actionColumns from '@utils/columns'
import Scrollable from '../../../../layout/Scrollable'
import RestaurantDetail from './RestaurantDetail'

const Restaurant = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [detailVisible, setDetailVisile] = useState(false)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    number | undefined
  >(undefined)
  const columns = useTablesStore(store => store.restaurant.columns)

  const showDetail = () => setDetailVisile(true)
  const hideDetail = () => {
    setDetailVisile(false)
  }

  const showCreateForm = () => {
    setSelectedRestaurantId(undefined)
    showDetail()
  }

  const pagination = usePagination()
  const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })

  const {
    data: restaurantResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetRestaurantsQuery(
    {
      limit: pagination.limit,
      offset: pagination.offset,
      search: filter.search,
      orderBy: filter.sortBy,
      status: filter.status,
    },
    {
      onSuccess: response => pagination.setTotal(response.total),
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteRestaurants, isLoading: isDeleting } =
    useDeleteRestaurantsMutation({
      onSuccess: () => {
        message.success({
          content:
            selectedRowKeys.length > 1
              ? t('restaurant.deleteMulti.success')
              : t('restaurant.delete.success'),
        })
        if (
          (pagination.total &&
            selectedRowKeys.length === pagination.total % pagination.limit) ||
          (selectedRowKeys.length === 0 &&
            pagination.offset + 1 === pagination.total)
        ) {
          pagination.setOffset(
            pagination.offset === 0 ? 0 : pagination.offset - pagination.limit
          )
        }
        setSelectedRowKeys([])
        queryClient.invalidateQueries('getRestaurants')
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleDeleteRestaurants = async () => {
    if (selectedRowKeys) {
      await deleteRestaurants(selectedRowKeys)
    }
  }

  const viewDetail = useCallback((id: number) => {
    setSelectedRestaurantId(id)
    showDetail()
  }, [])

  const deleteOne = async (id: number) => {
    await deleteRestaurants([id])
  }

  // reset selected row keys
  useEffect(() => {
    setSelectedRowKeys([])
  }, [restaurantResponse])

  const onSorterChange = (
    sorter: SorterResult<RestaurantModel>[] | SorterResult<RestaurantModel>
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
        title: t('common.field.id'),
        dataIndex: 'id',
        width: '10%',
      },
      {
        title: t('common.field.name'),
        dataIndex: 'name',
        ellipsis: true,
        sorter: {
          multiple: 3,
        },
        render: (name: string, record: RestaurantModel) => (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => viewDetail(record.id)}
          >
            {name}
          </span>
        ),
      },
      {
        title: t('common.field.altName'),
        dataIndex: 'altName',
        sorter: {
          multiple: 1,
        },
      },
      {
        title: t('common.field.code'),
        dataIndex: 'code',
        width: '10%',
        sorter: {
          multiple: 2,
        },
      },
      {
        title: t('common.field.status'),
        dataIndex: 'status',
        width: '15%',
        sorter: {
          multiple: 0,
        },
        render: (status: Status) => <StatusTag status={status} />,
      },
    ],
    [t, viewDetail]
  )

  const visibleColumns = useDeepMemo(() => {
    return originalColumns.filter(item => {
      const a = columns[item.dataIndex as keyof RestaurantModel]
      return a?.fixed || a?.checked
    })
  }, [columns])

  useWhyDidYouUpdate('restaurant', { columns, visibleColumns })

  return (
    <PageContent>
      <PageTitle label={t('restaurant.restaurants')} />
      <TableHeader<RestaurantModel>
        showDelete={selectedRowKeys.length > 0}
        isDeleting={isDeleting}
        onDelete={handleDeleteRestaurants}
        addButton={
          <ActionButton
            type="primary"
            icon={<AddIcon className="mr-2" />}
            onClick={showCreateForm}
          >
            <span className="font-medium">{t('common.add')}</span>
          </ActionButton>
        }
        onSearch={filter.setSearch}
        screenName="restaurant"
        isShowDropDownList
        refetch={refetch}
      />
      <Scrollable className="!px-0">
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isFetching} />}
        >
          <Table<RestaurantModel>
            rowSelection={{
              selectedRowKeys,
              onChange: keys => setSelectedRowKeys(keys as number[]),
            }}
            columns={actionColumns(
              viewDetail,
              deleteOne,
              <RestaurantIcon />,
              filter,
              visibleColumns,
              t
            )}
            dataSource={restaurantResponse?.restaurants.map(item => ({
              ...item,
              key: item.id,
            }))}
            loading={isLoading || isFetching}
            pagination={false}
            onChange={(_, __, sorter) => onSorterChange(sorter)}
          />
        </ConfigProvider>
      </Scrollable>
      {!isLoading && !!restaurantResponse?.total && (
        <Pagination
          config={pagination}
          totalItems={{
            total: restaurantResponse?.total,
            selected: selectedRowKeys.length,
          }}
        />
      )}
      <RestaurantDetail
        visible={detailVisible}
        onClose={hideDetail}
        onCreateSuccess={() => pagination.setOffset(0)}
        restaurantId={selectedRestaurantId}
      />
    </PageContent>
  )
}

export default Restaurant
