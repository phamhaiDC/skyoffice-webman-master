import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { ConfigProvider, message } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import { type PriceType as PriceTypeModel } from 'models'
import { Status } from 'models/swagger'
import { useDeletePriceTypesMutation, useGetPriceTypesQuery } from '@apis'
import { AddIcon } from '@assets/icons/Add'
import { ReactComponent as PriceTypeIcon } from '@assets/icons/PriceTypeIcon.svg'
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
import { PageContent } from '@layout/index'
import { useTablesStore } from '@store'
import actionColumns from '@utils/columns'
import Scrollable from '../../../../layout/Scrollable'
import PriceTypeDetail from './PriceTypeDetail'

const PriceType = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [detailVisible, setDetailVisile] = useState(false)
  const [selectedPriceTypeId, setSelectedPriceTypeId] = useState<
    number | undefined
  >(undefined)
  const columns = useTablesStore(store => store.priceType.columns)

  const showDetail = () => setDetailVisile(true)
  const hideDetail = () => {
    setDetailVisile(false)
  }

  const showCreateForm = () => {
    setSelectedPriceTypeId(undefined)
    showDetail()
  }

  const pagination = usePagination()
  const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })

  const {
    data: priceTypeResponse,
    isLoading,
    isFetching,
  } = useGetPriceTypesQuery(
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

  const { mutateAsync: deletePriceTypes, isLoading: isDeleting } =
    useDeletePriceTypesMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getPriceTypes')
        message.success({
          content:
            selectedRowKeys.length > 1
              ? t('priceType.deleteMulti.success')
              : t('priceType.delete.success'),
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
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleDeletePriceTypes = async () => {
    if (selectedRowKeys) {
      await deletePriceTypes(selectedRowKeys)
    }
  }

  const viewDetail = useCallback((id: number) => {
    setSelectedPriceTypeId(id)
    showDetail()
  }, [])

  const deleteOne = async (id: number) => {
    await deletePriceTypes([id])
  }

  // reset selected row keys
  useEffect(() => {
    setSelectedRowKeys([])
  }, [priceTypeResponse])

  const onSorterChange = (
    sorter: SorterResult<PriceTypeModel>[] | SorterResult<PriceTypeModel>
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
        render: (name: string, record: PriceTypeModel) => (
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
      const a = columns[item.dataIndex as keyof PriceTypeModel]
      return a?.fixed || a?.checked
    })
  }, [columns])

  return (
    <PageContent>
      <PageTitle label={t('priceType.priceTypes')} />
      <TableHeader<PriceTypeModel>
        showDelete={selectedRowKeys.length > 0}
        isDeleting={isDeleting}
        onDelete={handleDeletePriceTypes}
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
        screenName="priceType"
      />
      <Scrollable className="!px-0">
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isFetching} />}
        >
          <Table<PriceTypeModel>
            rowSelection={{
              selectedRowKeys,
              onChange: keys => setSelectedRowKeys(keys as number[]),
            }}
            columns={actionColumns(
              viewDetail,
              deleteOne,
              <PriceTypeIcon />,
              filter,
              visibleColumns,
              t
            )}
            dataSource={priceTypeResponse?.priceTypes.map(item => ({
              ...item,
              key: item.id,
            }))}
            loading={isLoading || isFetching}
            pagination={false}
            onChange={(_, __, sorter) => onSorterChange(sorter)}
          />
        </ConfigProvider>
      </Scrollable>
      {!isLoading && !!priceTypeResponse?.total && (
        <Pagination
          config={pagination}
          totalItems={{
            total: priceTypeResponse?.total,
            selected: selectedRowKeys.length,
          }}
        />
      )}
      <PriceTypeDetail
        visible={detailVisible}
        onClose={hideDetail}
        onCreateSuccess={() => pagination.setOffset(0)}
        priceTypeId={selectedPriceTypeId}
      />
    </PageContent>
  )
}

export default PriceType
