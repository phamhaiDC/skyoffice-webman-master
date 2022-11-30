import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { ConfigProvider, message } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import { type Modifier as ModifierModel, ModiGroup } from 'models'
import { Status } from 'models/swagger'
import styled from 'styled-components'
import {
  useDeleteModifiersMutation,
  useGetModifiersQuery,
  useGetModiGroupsQuery,
} from '@apis'
import { AddIcon } from '@assets/icons/Add'
import { ReactComponent as ModifierIcon } from '@assets/icons/ModifierIcon.svg'
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
import {
  Add as AddModifier,
  Detail as ModifierDetail,
} from './ModifierDetail/Modals'

const Modifier = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const columns = useTablesStore(store => store.modifier.columns)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [selectedModiGroup, setSelectedModiGroup] = useState<ModiGroup>()
  const [visibleAddModal, setVisibleAddModal] = useState(false)
  const [modifierId, setModifierId] = useState<number>()

  const { id: parent } = useParams()

  const parentId = parseInt(parent || '0', 10)

  const { data: modiGroupResponse } = useGetModiGroupsQuery(
    {},
    {
      refetchOnMount: false,
    }
  )

  useEffect(() => {
    setSelectedModiGroup(
      modiGroupResponse?.modiGroups.filter(item => item.id === parentId)[0]
    )
  }, [modiGroupResponse?.modiGroups, parentId])

  const pagination = usePagination()
  const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })

  const {
    data: modifierResponse,
    isLoading,
    isFetching,
  } = useGetModifiersQuery(
    {
      modiType: 0,
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

  const { mutateAsync: deleteModifiers, isLoading: isDeleting } =
    useDeleteModifiersMutation({
      onSuccess: () => {
        message.success({
          content:
            selectedRowKeys.length > 1
              ? t('modifier.item.deleteMulti.success')
              : t('modifier.item.delete.success'),
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
        queryClient.invalidateQueries('getModifiers')
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleDeleteModifiers = async () => {
    if (selectedRowKeys) {
      await deleteModifiers(selectedRowKeys)
    }
  }
  const deleteOne = async (id: number) => {
    await deleteModifiers([id])
  }

  // reset selected row keys
  useEffect(() => {
    setSelectedRowKeys([])
  }, [modifierResponse])

  // reset offset when selected key
  useEffect(() => {
    pagination.setOffset(0)
  }, [parentId])

  const onSorterChange = (
    sorter: SorterResult<ModifierModel>[] | SorterResult<ModifierModel>
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
        render: (name: string, record: ModifierModel) => (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setModifierId(record.id)}
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
        setModifierId,
        deleteOne,
        <ModifierIcon />,
        filter,
        originalColumns.filter(item => {
          const a = columns[item.dataIndex as keyof ModifierModel]
          return a?.fixed || a?.checked
        }),
        t
      ),
    [columns, deleteOne, filter, originalColumns, t]
  )

  return (
    <>
      <Container>
        <TableHeader<ModifierModel>
          showDelete={selectedRowKeys.length > 0}
          isDeleting={isDeleting}
          onDelete={handleDeleteModifiers}
          addButton={
            // <Dropdown overlay={actionList}>
            // </Dropdown>
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
          screenName="modifier"
          title={{
            name:
              parentId === 0
                ? t('common.all')
                : selectedModiGroup?.name || t('common.all'),
            description:
              parentId === 0
                ? t('modifier.group.allDescription')
                : selectedModiGroup?.comment,
          }}
        />
      </Container>
      <PageContent>
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isFetching} />}
        >
          <Table<ModifierModel>
            rowSelection={{
              selectedRowKeys,
              onChange: keys => setSelectedRowKeys(keys as number[]),
            }}
            columns={someCols}
            dataSource={modifierResponse?.modifiers.map(item => ({
              ...item,
              key: item.id,
            }))}
            loading={isLoading || isFetching}
            pagination={false}
            onChange={(_, __, sorter) => onSorterChange(sorter)}
          />
        </ConfigProvider>
      </PageContent>
      {!isLoading && !!modifierResponse?.total && (
        <Pagination
          config={pagination}
          totalItems={{
            total: modifierResponse?.total,
            selected: selectedRowKeys.length,
          }}
        />
      )}
      <AddModifier
        visible={visibleAddModal}
        onClose={() => setVisibleAddModal(false)}
        setModifierId={setModifierId}
      />
      <ModifierDetail
        modifierId={modifierId!}
        onClose={() => setModifierId(undefined)}
      />
    </>
  )
}

export default Modifier

const Container = styled.div.attrs({})``
