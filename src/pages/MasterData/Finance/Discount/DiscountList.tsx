import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { Button, ConfigProvider, message } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import { type Discount as DiscountModel, DiscountType } from 'models'
import { Status } from 'models/swagger'
import { PlusOutlined } from '@ant-design/icons'
import {
  useDeleteDiscountsMutation,
  useGetDiscountsQuery,
  useGetDiscountTypesQuery,
} from '@apis'
import { ReactComponent as DiscountIcon } from '@assets/icons/DiscountIcon.svg'
import Table from '@components/composites/Table'
import NoData from '@components/elements/NoData'
import StatusTag from '@components/elements/StatusTag'
import TableHeader from '@components/ListViewHeader'
import Pagination from '@components/Pagination'
import useFilter, { Sorter } from '@hooks/useFilter'
import usePagination from '@hooks/usePagination'
import { PageContent } from '@layout/index'
import { useTablesStore } from '@store'
import actionColumns from '@utils/columns'
import {
  Add as AddDiscount,
  Detail as DiscountDetail,
} from './DiscountInfo/Modals'

const DiscountList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const columns = useTablesStore(store => store.discount.columns)
  const [selectedDiscountType, setSelectedDiscountType] =
    useState<DiscountType>()
  const [visibleAddModal, setVisibleAddModal] = useState(false)
  const [discountId, setDiscountId] = useState<number>()

  const { id: parent } = useParams()

  const parentId = parseInt(parent || '0', 10)

  const pagination = usePagination()
  const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })

  const {
    data: discountResponse,
    isLoading,
    isFetching,
  } = useGetDiscountsQuery(
    {
      limit: pagination.limit,
      offset: pagination.offset,
      search: filter.search,
      orderBy: filter.sortBy,
      status: filter.status,
      parentId,
    },
    {
      onSuccess: response => pagination.setTotal(response.total),
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { data: discountTypeResponse } = useGetDiscountTypesQuery(
    {},
    {
      refetchOnMount: false,
    }
  )

  useEffect(() => {
    setSelectedDiscountType(
      discountTypeResponse?.discountTypes.filter(
        item => item.id === parentId
      )[0]
    )
  }, [discountTypeResponse?.discountTypes, parentId])

  const { mutateAsync: deleteDiscounts, isLoading: isDeleting } =
    useDeleteDiscountsMutation({
      onSuccess: () => {
        message.success({
          content:
            selectedRowKeys.length > 1
              ? t('discount.item.deleteMulti.success')
              : t('discount.item.delete.success'),
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
        queryClient.invalidateQueries('getDiscounts')
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleDeleteDiscounts = async () => {
    if (selectedRowKeys) {
      await deleteDiscounts(selectedRowKeys)
    }
  }

  const deleteOne = async (id: number) => {
    await deleteDiscounts([id])
  }

  // reset selected row keys
  useEffect(() => {
    setSelectedRowKeys([])
  }, [discountResponse])

  // reset offset when selected key
  useEffect(() => {
    pagination.setOffset(0)
  }, [parentId])

  const onSorterChange = (
    sorter: SorterResult<DiscountModel>[] | SorterResult<DiscountModel>
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
        render: (id: number) => <div className="min-w-fit">{id}</div>,
      },
      {
        title: t('common.field.name'),
        dataIndex: 'name',
        ellipsis: true,
        sorter: {
          multiple: 3,
        },
        render: (name: string, record: DiscountModel) => (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setDiscountId(record.id)}
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
        sorter: {
          multiple: 2,
        },
        width: '10%',
        render: (code: number) => <div className="min-w-fit">{code}</div>,
      },
      {
        title: t('common.field.status'),
        dataIndex: 'status',
        sorter: {
          multiple: 0,
        },
        width: '15%',
        render: (_status: Status) => (
          <div className="min-w-fit">
            <StatusTag status={_status} />
          </div>
        ),
      },
    ],
    [t]
  )

  const someCols = useMemo(
    () =>
      actionColumns(
        setDiscountId,
        deleteOne,
        <DiscountIcon />,
        filter,
        originalColumns.filter(item => {
          const a = columns[item.dataIndex as keyof DiscountModel]
          return a?.fixed || a?.checked
        }),
        t
      ),
    [columns, deleteOne, filter, originalColumns, t]
  )

  return (
    <>
      <TableHeader<DiscountModel>
        showDelete={selectedRowKeys.length > 0}
        isDeleting={isDeleting}
        onDelete={handleDeleteDiscounts}
        addButton={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            shape="round"
            onClick={() => setVisibleAddModal(true)}
          >
            {t('common.add')}
          </Button>
        }
        onSearch={filter.setSearch}
        screenName="discount"
        title={{
          name:
            parentId === 0
              ? t('common.all')
              : selectedDiscountType?.name || t('common.all'),
          description:
            parentId === 0
              ? t('discount.type.allDescription')
              : selectedDiscountType?.description,
        }}
      />
      <PageContent>
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isFetching} />}
        >
          <Table<DiscountModel>
            rowSelection={{
              selectedRowKeys,
              onChange: keys => setSelectedRowKeys(keys as number[]),
            }}
            columns={someCols}
            dataSource={discountResponse?.discounts.map(item => ({
              ...item,
              key: item.id,
            }))}
            loading={isLoading || isFetching}
            pagination={false}
            onChange={(_, __, sorter) => onSorterChange(sorter)}
          />
        </ConfigProvider>
      </PageContent>
      {!!discountResponse?.total && (
        <Pagination
          config={pagination}
          totalItems={{
            total: discountResponse?.total,
            selected: selectedRowKeys.length,
          }}
        />
      )}
      <AddDiscount
        visible={visibleAddModal}
        onClose={() => setVisibleAddModal(false)}
        setDiscountId={setDiscountId}
      />
      <DiscountDetail
        discountId={discountId!}
        onClose={() => setDiscountId(undefined)}
      />
    </>
  )
}

export default DiscountList
