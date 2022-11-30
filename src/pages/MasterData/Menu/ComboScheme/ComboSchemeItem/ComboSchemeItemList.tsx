import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { ConfigProvider, message } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import { type ComboScheme as ComboSchemeModel } from 'models'
import { Status } from 'models/swagger'
import styled from 'styled-components'
import { useDeleteComboSchemesMutation, useGetComboSchemesQuery } from '@apis'
import { AddIcon } from '@assets/icons/Add'
import { ReactComponent as ComboSchemeIcon } from '@assets/icons/ComboSchemeIcon.svg'
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
import { Add as AddModal, Detail as ComboSchemeModal } from './Modals'

const ComboSchemeItemList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const columns = useTablesStore(store => store.comboScheme.columns)
  const [selectedComboSchemeGroup, setSelectedComboSchemeGroup] =
    useState<ComboSchemeModel>()
  const [visibleAddModal, setVisibleAddModal] = useState(false)
  const [comboSchemeId, setComboSchemeId] = useState<number>()

  const { id: parent } = useParams()

  const parentId = parseInt(parent || '0', 10)

  const { data: comboSchemeGroupResponse } = useGetComboSchemesQuery({
    modiSchemeType: 3,
  })

  useEffect(() => {
    setSelectedComboSchemeGroup(
      comboSchemeGroupResponse?.modiSchemes.filter(
        item => item.id === parentId
      )[0]
    )
  }, [comboSchemeGroupResponse?.modiSchemes, parentId])

  const pagination = usePagination()
  const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })

  const {
    data: comboSchemeResponse,
    isLoading,
    isFetching,
  } = useGetComboSchemesQuery(
    {
      limit: pagination.limit,
      offset: pagination.offset,
      search: filter.search,
      orderBy: filter.sortBy,
      status: filter.status,
      parentId,
      modiSchemeType: 1,
    },
    {
      onSuccess: response => pagination.setTotal(response.total),
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteComboScheme, isLoading: isDeleting } =
    useDeleteComboSchemesMutation({
      onSuccess: () => {
        message.success({
          content:
            selectedRowKeys.length > 1
              ? t('comboScheme.deleteMulti.success')
              : t('comboScheme.delete.success'),
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
        queryClient.invalidateQueries('getComboSchemes')
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleDeleteComboScheme = async () => {
    if (selectedRowKeys) {
      await deleteComboScheme(selectedRowKeys)
    }
  }

  const deleteOne = async (id: number) => {
    await deleteComboScheme([id])
  }

  // reset selected row keys
  useEffect(() => {
    setSelectedRowKeys([])
  }, [comboSchemeResponse])

  // reset offset when selected key
  useEffect(() => {
    pagination.setOffset(0)
  }, [parentId])

  const onSorterChange = (
    sorter: SorterResult<ComboSchemeModel>[] | SorterResult<ComboSchemeModel>
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
        render: (name: string, record: ComboSchemeModel) => (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setComboSchemeId(record.id)}
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
        setComboSchemeId,
        deleteOne,
        <ComboSchemeIcon />,
        filter,
        originalColumns.filter(item => {
          const a = columns[item.dataIndex as keyof ComboSchemeModel]
          return a?.fixed || a?.checked
        }),
        t
      ),
    [columns, deleteOne, filter, originalColumns, t]
  )

  return (
    <>
      <Container>
        <TableHeader<ComboSchemeModel>
          showDelete={selectedRowKeys.length > 0}
          isDeleting={isDeleting}
          onDelete={handleDeleteComboScheme}
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
          screenName="comboScheme"
          title={{
            name:
              parentId === 0
                ? t('common.all')
                : selectedComboSchemeGroup?.name || t('common.all'),
            description:
              parentId === 0
                ? t('comboScheme.group.allDescription')
                : selectedComboSchemeGroup?.description,
          }}
        />
      </Container>
      <PageContent>
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isFetching} />}
        >
          <Table<ComboSchemeModel>
            rowSelection={{
              selectedRowKeys,
              onChange: keys => setSelectedRowKeys(keys as number[]),
            }}
            columns={someCols}
            dataSource={comboSchemeResponse?.modiSchemes.map(item => ({
              ...item,
              key: item.id,
            }))}
            loading={isLoading || isFetching}
            pagination={false}
            onChange={(_, __, sorter) => onSorterChange(sorter)}
          />
        </ConfigProvider>
      </PageContent>
      {!isLoading && !!comboSchemeResponse?.total && (
        <Pagination
          config={pagination}
          totalItems={{
            total: comboSchemeResponse?.total,
            selected: selectedRowKeys.length,
          }}
        />
      )}
      <AddModal
        visible={visibleAddModal}
        onClose={() => setVisibleAddModal(false)}
        setComboSchemeId={setComboSchemeId}
      />
      <ComboSchemeModal
        comboSchemeId={comboSchemeId!}
        onClose={() => setComboSchemeId(undefined)}
      />
    </>
  )
}

export default ComboSchemeItemList

const Container = styled.div.attrs({})``
