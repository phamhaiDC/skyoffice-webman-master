import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { ConfigProvider, message } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import { type Combo as ComboModel, ComboGroup } from 'models'
import { Status } from 'models/swagger'
import styled from 'styled-components'
import {
  useDeleteCombosMutation,
  useGetComboGroupsQuery,
  useGetCombosQuery,
} from '@apis'
import { AddIcon } from '@assets/icons/Add'
import { ReactComponent as ComboIcon } from '@assets/icons/ComboIcon.svg'
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
import { Add as AddModal, Detail as ComboDetail } from './ComboDetail/Modals'

const ComboList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const columns = useTablesStore(store => store.combo.columns)
  const [selectedComboGroup, setSelectedComboGroup] = useState<ComboGroup>()
  const [visibleAddModal, setVisibleAddModal] = useState(false)
  const [comboId, setComboId] = useState<number>()

  const { id: parent } = useParams()

  const parentId = parseInt(parent || '0', 10)

  const { data: comboGroupResponse } = useGetComboGroupsQuery({})

  useEffect(() => {
    setSelectedComboGroup(
      comboGroupResponse?.modiGroups.filter(item => item.id === parentId)[0]
    )
  }, [comboGroupResponse?.modiGroups, parentId])

  const pagination = usePagination()
  const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })

  const {
    data: comboResponse,
    isLoading,
    isFetching,
  } = useGetCombosQuery(
    {
      modiType: 1,
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

  const { mutateAsync: deleteCombos, isLoading: isDeleting } =
    useDeleteCombosMutation({
      onSuccess: () => {
        message.success({
          content:
            selectedRowKeys.length > 1
              ? t('combo.item.deleteMulti.success')
              : t('combo.item.delete.success'),
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
        queryClient.invalidateQueries('getCombos')
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleDeleteCombos = async () => {
    if (selectedRowKeys) {
      await deleteCombos(selectedRowKeys)
    }
  }

  const deleteOne = async (id: number) => {
    await deleteCombos([id])
  }

  // reset selected row keys
  useEffect(() => {
    setSelectedRowKeys([])
  }, [comboResponse])

  // reset offset when select key
  useEffect(() => {
    pagination.setOffset(0)
  }, [parentId])

  const onSorterChange = (
    sorter: SorterResult<ComboModel>[] | SorterResult<ComboModel>
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
        render: (name: string, record: ComboModel) => (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setComboId(record.id)}
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
        setComboId,
        deleteOne,
        <ComboIcon />,
        filter,
        originalColumns.filter(item => {
          const a = columns[item.dataIndex as keyof ComboModel]
          return a?.fixed || a?.checked
        }),
        t
      ),
    [columns, deleteOne, filter, originalColumns, t]
  )

  return (
    <>
      <Container>
        <TableHeader<ComboModel>
          showDelete={selectedRowKeys.length > 0}
          isDeleting={isDeleting}
          onDelete={handleDeleteCombos}
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
          screenName="combo"
          title={{
            name:
              parentId === 0
                ? t('common.all')
                : selectedComboGroup?.name || t('common.all'),
            description:
              parentId === 0
                ? t('combo.group.allDescription')
                : selectedComboGroup?.description,
          }}
        />
      </Container>
      <PageContent>
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isFetching} />}
        >
          <Table<ComboModel>
            rowSelection={{
              selectedRowKeys,
              onChange: keys => setSelectedRowKeys(keys as number[]),
            }}
            columns={someCols}
            dataSource={comboResponse?.modifiers.map(item => ({
              ...item,
              key: item.id,
            }))}
            loading={isLoading || isFetching}
            pagination={false}
            onChange={(_, __, sorter) => onSorterChange(sorter)}
          />
        </ConfigProvider>
      </PageContent>
      {!isLoading && !!comboResponse?.total && (
        <Pagination
          config={pagination}
          totalItems={{
            total: comboResponse?.total,
            selected: selectedRowKeys.length,
          }}
        />
      )}
      <AddModal
        visible={visibleAddModal}
        onClose={() => setVisibleAddModal(false)}
        setComboId={setComboId}
      />
      <ComboDetail comboId={comboId!} onClose={() => setComboId(undefined)} />
    </>
  )
}

export default ComboList

const Container = styled.div.attrs({})``
