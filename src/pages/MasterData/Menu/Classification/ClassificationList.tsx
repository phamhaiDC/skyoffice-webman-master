import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { ConfigProvider, Dropdown, Menu, message } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import { type Classification as ClassificationModel } from 'models'
import { Status } from 'models/swagger'
import styled from 'styled-components'
import {
  useDeleteClassificationsMutation,
  useGetClassificationGroupsQuery,
  useGetClassificationsQuery,
} from '@apis'
import { AddIcon } from '@assets/icons/Add'
import { ReactComponent as ClassificationGroupIcon } from '@assets/icons/ClassificationGroupIcon.svg'
import { ReactComponent as ClassificationIcon } from '@assets/icons/ClassificationIcon.svg'
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

const ClassificationList = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const columns = useTablesStore(store => store.classification.columns)
  const [selectedClassificationGroup, setSelectedClassificationGroup] =
    useState<ClassificationModel>()

  const classificationGroupId = parseInt(
    useParams().classificationGroupId || '0',
    10
  )

  const { data: classificationGroupResponse } = useGetClassificationGroupsQuery(
    { parentId: 0 }
  )

  useEffect(() => {
    setSelectedClassificationGroup(
      classificationGroupResponse?.classificatorGroups.filter(
        item => item.id === classificationGroupId
      )[0]
    )
  }, [classificationGroupResponse?.classificatorGroups, classificationGroupId])

  const pagination = usePagination()
  const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })

  const {
    data: classificationResponse,
    isLoading,
    isFetching,
  } = useGetClassificationsQuery(
    {
      limit: pagination.limit,
      offset: pagination.offset,
      search: filter.search,
      orderBy: filter.sortBy,
      status: filter.status,
      parentId: classificationGroupId,
    },
    {
      onSuccess: response => pagination.setTotal(response.total),
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const { mutateAsync: deleteClassifications, isLoading: isDeleting } =
    useDeleteClassificationsMutation({
      onSuccess: () => {
        message.success({
          content:
            selectedRowKeys.length > 1
              ? t('classification.item.deleteMulti.success')
              : t('classification.item.delete.success'),
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
        queryClient.invalidateQueries('getClassifications')
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleDeleteClassifications = async () => {
    if (selectedRowKeys) {
      await deleteClassifications(selectedRowKeys)
    }
  }

  const viewDetail = useCallback(
    (id: number) => {
      navigate(`classifications/${id}`)
    },
    [navigate]
  )

  const deleteOne = async (id: number) => {
    await deleteClassifications([id])
  }

  // reset selected row keys
  useEffect(() => {
    setSelectedRowKeys([])
  }, [classificationResponse])

  // reset offset when selected key
  useEffect(() => {
    pagination.setOffset(0)
  }, [classificationGroupId])

  const onSorterChange = (
    sorter:
      | SorterResult<ClassificationModel>[]
      | SorterResult<ClassificationModel>
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
        render: (name: string, record: ClassificationModel) => (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() =>
              navigate(
                `/menu/classification-groups/${classificationGroupId}/classifications/${record.id}`
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
    [navigate, classificationGroupId, t]
  )

  const someCols = useMemo(
    () =>
      actionColumns(
        viewDetail,
        deleteOne,
        <ClassificationIcon />,
        filter,
        originalColumns.filter(item => {
          const a = columns[item.dataIndex as keyof ClassificationModel]
          return a?.fixed || a?.checked
        }),
        t
      ),
    [columns, deleteOne, filter, originalColumns, t, viewDetail]
  )

  return (
    <>
      <Container>
        <TableHeader<ClassificationModel>
          showDelete={selectedRowKeys.length > 0}
          isDeleting={isDeleting}
          onDelete={handleDeleteClassifications}
          addButton={
            // <Dropdown overlay={actionList}>
            // </Dropdown>
            <ActionButton
              type="primary"
              icon={<AddIcon className="mr-2" />}
              onClick={() => {
                navigate('classifications')
              }}
            >
              <span className="font-medium">{t('common.add')}</span>
            </ActionButton>
          }
          onSearch={filter.setSearch}
          screenName="classification"
          title={{
            name:
              classificationGroupId === 0
                ? t('common.all')
                : selectedClassificationGroup?.name || t('common.all'),
            description:
              classificationGroupId === 0
                ? t('classification.group.allDescription')
                : selectedClassificationGroup?.description,
          }}
        />
      </Container>
      <PageContent>
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isFetching} />}
        >
          <Table<ClassificationModel>
            rowSelection={{
              selectedRowKeys,
              onChange: keys => setSelectedRowKeys(keys as number[]),
            }}
            columns={someCols}
            dataSource={classificationResponse?.classificatorGroups.map(
              item => ({
                ...item,
                key: item.id,
              })
            )}
            loading={isLoading || isFetching}
            pagination={false}
            onChange={(_, __, sorter) => onSorterChange(sorter)}
          />
        </ConfigProvider>
      </PageContent>
      {!isLoading && !!classificationResponse?.total && (
        <Pagination
          config={pagination}
          totalItems={{
            total: classificationResponse?.total,
            selected: selectedRowKeys.length,
          }}
        />
      )}
    </>
  )
}

export default ClassificationList

const Container = styled.div.attrs({})``
