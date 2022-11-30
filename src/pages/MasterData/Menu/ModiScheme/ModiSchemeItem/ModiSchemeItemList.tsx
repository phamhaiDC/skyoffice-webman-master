import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { ConfigProvider, message } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import { type ModiScheme as ModiSchemeModel } from 'models'
import { Status } from 'models/swagger'
import styled from 'styled-components'
import { useDeleteModiSchemesMutation, useGetModiSchemesQuery } from '@apis'
import { AddIcon } from '@assets/icons/Add'
import { ReactComponent as ModifierSchemeIcon } from '@assets/icons/ModifierSchemeIcon.svg'
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
import { Add as AddModal, Detail as ModiSchemeDetailModal } from './Modals'

const ModiSchemeItemList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const columns = useTablesStore(store => store.modiScheme.columns)
  const [selectedModiSchemeGroup, setSelectedModiSchemeGroup] =
    useState<ModiSchemeModel>()
  const [visibleAddModal, setVisibleAddModal] = useState(false)
  const [modiSchemeId, setModiSchemeId] = useState<number>()

  const { id: parent } = useParams()

  const parentId = parseInt(parent || '0', 10)

  const { data: modiSchemeGroupResponse } = useGetModiSchemesQuery(
    { modiSchemeType: 2 },
    {
      refetchOnMount: false,
    }
  )

  useEffect(() => {
    setSelectedModiSchemeGroup(
      modiSchemeGroupResponse?.modiSchemes.filter(
        item => item.id === parentId
      )[0]
    )
  }, [modiSchemeGroupResponse?.modiSchemes, parentId])

  const pagination = usePagination()
  const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })

  const {
    data: modiSchemeResponse,
    isLoading,
    isFetching,
  } = useGetModiSchemesQuery(
    {
      limit: pagination.limit,
      offset: pagination.offset,
      search: filter.search,
      orderBy: filter.sortBy,
      status: filter.status,
      parentId,
      modiSchemeType: 0,
    },
    {
      onSuccess: response => pagination.setTotal(response.total),
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteModiScheme, isLoading: isDeleting } =
    useDeleteModiSchemesMutation({
      onSuccess: () => {
        message.success({
          content:
            selectedRowKeys.length > 1
              ? t('modiScheme.deleteMulti.success')
              : t('modiScheme.delete.success'),
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
        queryClient.invalidateQueries('getModiSchemes')
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleDeleteModiScheme = async () => {
    if (selectedRowKeys) {
      await deleteModiScheme(selectedRowKeys)
    }
  }

  const deleteOne = async (id: number) => {
    await deleteModiScheme([id])
  }

  // reset selected row keys
  useEffect(() => {
    setSelectedRowKeys([])
  }, [modiSchemeResponse])

  // reset offset when selected key
  useEffect(() => {
    pagination.setOffset(0)
  }, [parentId])

  const onSorterChange = (
    sorter: SorterResult<ModiSchemeModel>[] | SorterResult<ModiSchemeModel>
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
        render: (name: string, record: ModiSchemeModel) => (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setModiSchemeId(record.id)}
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
    [t]
  )

  const someCols = useMemo(
    () =>
      actionColumns(
        setModiSchemeId,
        deleteOne,
        <ModifierSchemeIcon />,
        filter,
        originalColumns.filter(item => {
          const a = columns[item.dataIndex as keyof ModiSchemeModel]
          return a?.fixed || a?.checked
        }),
        t
      ),
    [columns, deleteOne, filter, originalColumns, t]
  )

  return (
    <>
      <Container>
        <TableHeader<ModiSchemeModel>
          showDelete={selectedRowKeys.length > 0}
          isDeleting={isDeleting}
          onDelete={handleDeleteModiScheme}
          addButton={
            <ActionButton
              type="primary"
              icon={<AddIcon className="mr-2" />}
              onClick={() => {
                setVisibleAddModal(true)
              }}
            >
              <span className="font-medium">{t('common.add')}</span>
            </ActionButton>
          }
          onSearch={filter.setSearch}
          screenName="modiScheme"
          title={{
            name:
              parentId === 0
                ? t('common.all')
                : selectedModiSchemeGroup?.name || t('common.all'),
            description:
              parentId === 0
                ? t('modiScheme.group.allDescription')
                : selectedModiSchemeGroup?.description,
          }}
        />
      </Container>
      <PageContent>
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isFetching} />}
        >
          <Table<ModiSchemeModel>
            rowSelection={{
              selectedRowKeys,
              onChange: keys => setSelectedRowKeys(keys as number[]),
            }}
            columns={someCols}
            dataSource={modiSchemeResponse?.modiSchemes.map(item => ({
              ...item,
              key: item.id,
            }))}
            loading={isLoading || isFetching}
            pagination={false}
            onChange={(_, __, sorter) => onSorterChange(sorter)}
          />
        </ConfigProvider>
      </PageContent>
      {!isLoading && !!modiSchemeResponse?.total && (
        <Pagination
          config={pagination}
          totalItems={{
            total: modiSchemeResponse?.total,
            selected: selectedRowKeys.length,
          }}
        />
      )}
      <AddModal
        visible={visibleAddModal}
        onClose={() => setVisibleAddModal(false)}
        setModiSchemeId={setModiSchemeId}
      />
      <ModiSchemeDetailModal
        modiSchemeId={modiSchemeId!}
        onClose={() => setModiSchemeId(undefined)}
      />
    </>
  )
}

export default ModiSchemeItemList

const Container = styled.div.attrs({})``
