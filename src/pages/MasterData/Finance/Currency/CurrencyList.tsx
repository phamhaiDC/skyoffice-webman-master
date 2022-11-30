import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { ConfigProvider, Menu, message } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import { type Currency as CurrencyModel, CurrencyType } from 'models'
import { Status } from 'models/swagger'
import styled from 'styled-components'
import {
  useDeleteCurrenciesMutation,
  useGetCurrenciesQuery,
  useGetCurrencyTypesQuery,
} from '@apis'
import { AddIcon } from '@assets/icons/Add'
import { ReactComponent as CurrencyIcon } from '@assets/icons/CurrencyIcon.svg'
import Table from '@components/composites/Table'
import { ActionButton } from '@components/elements/ActionButton'
import NoData from '@components/elements/NoData'
import StatusTag from '@components/elements/StatusTag'
import TableHeader from '@components/ListViewHeader'
import Pagination from '@components/Pagination'
import useFilter, { Sorter } from '@hooks/useFilter'
import usePagination from '@hooks/usePagination'
import { PageContent } from '@layout/index'
import { useTablesStore } from '@store'
import actionColumns from '@utils/columns'

const Currency = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const columns = useTablesStore(store => store.currency.columns)
  const [selectedCurrencyType, setSelectedCurrencyType] =
    useState<CurrencyType>()

  const { id: parent } = useParams()

  const parentId = parseInt(parent || '0', 10)

  const { data: currencyTypeResponse } = useGetCurrencyTypesQuery({})

  useEffect(() => {
    setSelectedCurrencyType(
      currencyTypeResponse?.currencyTypes.filter(
        item => item.id === parentId
      )[0]
    )
  }, [currencyTypeResponse?.currencyTypes, parentId])

  const pagination = usePagination()
  const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })

  const {
    data: currencyResponse,
    isLoading,
    isFetching,
  } = useGetCurrenciesQuery(
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

  const { mutateAsync: deleteCurrencies, isLoading: isDeleting } =
    useDeleteCurrenciesMutation({
      onSuccess: () => {
        message.success({
          content:
            selectedRowKeys.length > 1
              ? t('currency.item.deleteMulti.success')
              : t('currency.item.delete.success'),
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
        queryClient.invalidateQueries('getCurrencies')
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleDeleteCurrencies = async () => {
    if (selectedRowKeys) {
      await deleteCurrencies(selectedRowKeys)
    }
  }

  const viewDetail = useCallback(
    (id: number) => {
      navigate(`currencies/${id}`)
    },
    [navigate]
  )

  const deleteOne = async (id: number) => {
    await deleteCurrencies([id])
  }

  // reset selected row keys
  useEffect(() => {
    setSelectedRowKeys([])
  }, [currencyResponse])

  // reset offset when selected key
  useEffect(() => {
    pagination.setOffset(0)
  }, [parentId])

  const onSorterChange = (
    sorter: SorterResult<CurrencyModel>[] | SorterResult<CurrencyModel>
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
        render: (name: string, record: CurrencyModel) => (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() =>
              navigate(
                `/finance/currency-types/${parentId}/currencies/${record.id}`
              )
            }
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
    [navigate, parentId, t]
  )

  const someCols = useMemo(
    () =>
      actionColumns(
        viewDetail,
        deleteOne,
        <CurrencyIcon />,
        filter,
        originalColumns.filter(item => {
          const a = columns[item.dataIndex as keyof CurrencyModel]
          return a?.fixed || a?.checked
        }),
        t
      ),
    [columns, deleteOne, filter, originalColumns, t, viewDetail]
  )

  return (
    <>
      <Container>
        <TableHeader<CurrencyModel>
          showDelete={selectedRowKeys.length > 0}
          isDeleting={isDeleting}
          onDelete={handleDeleteCurrencies}
          addButton={
            // <Dropdown overlay={actionList}>
            //   <ActionButton type="primary" icon={<AddIcon className="mr-2" />}>
            //     <span className="font-medium">{t('common.add')}</span>
            //   </ActionButton>
            // </Dropdown>
            <ActionButton
              type="primary"
              icon={<AddIcon className="mr-2" />}
              onClick={() => {
                navigate('currencies')
              }}
            >
              <span className="font-medium">{t('common.add')}</span>
            </ActionButton>
          }
          onSearch={filter.setSearch}
          screenName="currency"
          title={{
            name:
              parentId === 0
                ? t('common.all')
                : selectedCurrencyType?.name || t('common.all'),
            description:
              parentId === 0
                ? t('currency.type.allDescription')
                : selectedCurrencyType?.description,
          }}
        />
      </Container>
      <PageContent>
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isFetching} />}
        >
          <Table<CurrencyModel>
            rowSelection={{
              selectedRowKeys,
              onChange: keys => setSelectedRowKeys(keys as number[]),
            }}
            columns={someCols}
            dataSource={currencyResponse?.currencies.map(item => ({
              ...item,
              key: item.id,
            }))}
            loading={isLoading || isFetching}
            pagination={false}
            onChange={(_, __, sorter) => onSorterChange(sorter)}
          />
        </ConfigProvider>
      </PageContent>
      {!isLoading && !!currencyResponse?.total && (
        <Pagination
          config={pagination}
          totalItems={{
            total: currencyResponse?.total,
            selected: selectedRowKeys.length,
          }}
        />
      )}
    </>
  )
}

export default Currency

const Container = styled.div.attrs({})``
