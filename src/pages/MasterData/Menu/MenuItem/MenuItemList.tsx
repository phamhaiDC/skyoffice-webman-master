import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { Button, ConfigProvider, message } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import { type MenuItem as MenuItemModel, MenuGroup } from 'models'
import { Status } from 'models/swagger'
import { PlusOutlined } from '@ant-design/icons'
import {
  useDeleteMenuItemsMutation,
  useGetMenuGroupsQuery,
  useGetMenuItemsQuery,
} from '@apis'
import { ReactComponent as MenuItemIcon } from '@assets/icons/MenuItemIcon.svg'
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
  Add as AddMenuItem,
  Detail as MenuItemDetail,
} from './MenuItemDetail/Modals'

type Props = {
  menuItemsTitle?: string
}
const MenuItemList: React.FC<Props> = ({ menuItemsTitle }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const columns = useTablesStore(store => store.menuItem.columns)
  const [selectedMenuGroup, setSelectedMenuGroup] = useState<MenuGroup>()
  const [visibleAddModal, setVisibleAddModal] = useState(false)
  const [menuItemId, setMenuItemId] = useState<number>()

  const { id: parent } = useParams()

  const parentId = parseInt(parent || '0', 10)

  const pagination = usePagination()
  const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })

  const { data: menuGroupResponse } = useGetMenuGroupsQuery(
    {},
    {
      refetchOnMount: false,
    }
  )

  useEffect(() => {
    setSelectedMenuGroup(
      menuGroupResponse?.categList.filter(item => item.id === parentId)[0]
    )
  }, [menuGroupResponse?.categList, parentId])

  const {
    data: menuItemResponse,
    isLoading,
    isFetching,
  } = useGetMenuItemsQuery(
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

  const { mutateAsync: deleteMenuItems, isLoading: isDeleting } =
    useDeleteMenuItemsMutation({
      onSuccess: () => {
        message.success({
          content:
            selectedRowKeys.length > 1
              ? t('menuItem.item.deleteMulti.success')
              : t('menuItem.item.delete.success'),
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
        queryClient.invalidateQueries('getMenuItems')
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleDeleteMenuItems = async () => {
    if (selectedRowKeys) {
      await deleteMenuItems(selectedRowKeys)
    }
  }

  const deleteOne = (id: number) => deleteMenuItems([id])

  // reset selected row keys
  useEffect(() => {
    setSelectedRowKeys([])
  }, [menuItemResponse])

  // reset offset when selected key
  useEffect(() => {
    pagination.setOffset(0)
  }, [parentId])

  const onSorterChange = (
    sorter: SorterResult<MenuItemModel>[] | SorterResult<MenuItemModel>
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
        render: (name: string, record: MenuItemModel) => (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setMenuItemId(record.id)}
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
        setMenuItemId,
        deleteOne,
        <MenuItemIcon />,
        filter,
        originalColumns.filter(item => {
          const a = columns[item.dataIndex as keyof MenuItemModel]
          return a?.fixed || a?.checked
        }),
        t
      ),
    [columns, deleteOne, filter, originalColumns, t]
  )

  return (
    <>
      <TableHeader<MenuItemModel>
        showDelete={selectedRowKeys.length > 0}
        isDeleting={isDeleting}
        onDelete={handleDeleteMenuItems}
        addButton={
          // <Dropdown overlay={actionList}>
          //   <Button
          //     type="primary"
          //     icon={<PlusOutlined />}
          //     loading={isCreating}
          //     shape="round"
          //   >
          //     {t('common.add')}
          //   </Button>
          // </Dropdown>
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
        screenName="menuItem"
        title={{
          name:
            parentId === 0
              ? t('common.all')
              : selectedMenuGroup?.name || t('common.all'),
          description:
            parentId === 0 && !!menuItemsTitle === false
              ? t('menuItem.group.allDescription')
              : menuItemsTitle || selectedMenuGroup?.description,
        }}
      />
      <PageContent>
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isFetching} />}
        >
          <Table<MenuItemModel>
            rowSelection={{
              selectedRowKeys,
              onChange: keys => setSelectedRowKeys(keys as number[]),
            }}
            columns={someCols}
            dataSource={menuItemResponse?.menuItems.map(item => ({
              ...item,
              key: item.id,
            }))}
            rowKey={item => item.id}
            loading={isLoading || isFetching}
            onChange={(_, __, sorter) => onSorterChange(sorter)}
          />
        </ConfigProvider>
      </PageContent>
      {!isLoading && !!menuItemResponse?.total && (
        <Pagination
          config={pagination}
          totalItems={{
            total: menuItemResponse?.total,
            selected: selectedRowKeys.length,
          }}
        />
      )}
      <AddMenuItem
        visible={visibleAddModal}
        onClose={() => setVisibleAddModal(false)}
        setMenuItemId={setMenuItemId}
      />
      <MenuItemDetail
        menuItemId={menuItemId!}
        onClose={() => setMenuItemId(undefined)}
      />
    </>
  )
}

export default MenuItemList
