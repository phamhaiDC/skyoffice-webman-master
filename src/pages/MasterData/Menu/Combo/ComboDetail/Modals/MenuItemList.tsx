import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, message, Tooltip } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import { MenuItem, MenuItem as MenuItemModel } from 'models'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { ArrowRightOutlined } from '@ant-design/icons'
import { useGetMenuItemsQuery } from '@apis'
import Table from '@components/composites/Table'
import SearchInput from '@components/elements/SearchInput'
import StatusTag from '@components/elements/StatusTag'
import Pagination from '@components/Pagination'
import useFilter, { Sorter } from '@hooks/useFilter'
import usePagination from '@hooks/usePagination'
import Scrollable from '../../../../../../layout/Scrollable'
import { Status } from '../../../../../../models/swagger'

type Props = {
  customClass?: string
  parentId?: number
  onClose: () => void
  onOk: (menuItem: Pick<MenuItemModel, 'id' | 'name'>) => void
}

export const MenuItemList: React.FC<Props> = ({
  parentId,
  onClose,
  onOk,
  customClass,
}) => {
  const { t } = useTranslation()
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<Pick<MenuItemModel, 'id' | 'name'>>()

  const pagination = usePagination()
  const filter = useFilter({ goToFirstPage: () => pagination.setOffset(0) })
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
      saleObjectType: 0,
    },
    {
      onSuccess: response => pagination.setTotal(response.total),
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

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
        width: '15%',
      },
      {
        title: t('common.field.name'),
        dataIndex: 'name',
        ellipsis: true,
        sorter: {
          multiple: 3,
        },
        render: (name: string) => <span className="text-black">{name}</span>,
      },
      {
        title: t('common.field.code'),
        dataIndex: 'code',
        sorter: {
          multiple: 2,
        },
        width: '15%',
      },
      {
        title: t('common.field.status'),
        dataIndex: 'status',
        sorter: {
          multiple: 0,
        },
        width: '20%',
        render: (_status: Status) => (
          <div className="min-w-fit">
            <StatusTag status={_status} />
          </div>
        ),
      },
      {
        width: '5%',
        render: (menuItem: MenuItem) => (
          <StyledButton size="small">
            <Tooltip title={t('common.selectThisItem')}>
              <ArrowRightOutlined
                onClick={() => {
                  onOk(menuItem)
                  onClose()
                }}
              />
            </Tooltip>
          </StyledButton>
        ),
      },
    ],
    [onClose, onOk, t]
  )

  return (
    <Container>
      <Header>
        <SearchInput
          placeholder={`${t('common.search')}...`}
          allowClear
          enterButton
          onSearch={filter.setSearch}
          className="w-fit"
        />
      </Header>
      <Body>
        <StyledSrollable>
          <Table<MenuItemModel>
            columns={originalColumns}
            dataSource={menuItemResponse?.menuItems.map(item => ({
              ...item,
              key: item.id,
            }))}
            loading={isLoading || isFetching}
            onChange={(_, __, sorter) => onSorterChange(sorter)}
            className="!pl-0 !pr-2 cursor-pointer"
            rowSelection={{
              selectedRowKeys: selectedMenuItem ? [selectedMenuItem.id] : [],
              type: 'radio',
              onChange: e =>
                setSelectedMenuItem({
                  id: e[0] as number,
                  name:
                    menuItemResponse?.menuItems.filter(
                      item => item.id === (e[0] as number)
                    )[0].name || '',
                }),
            }}
            onRow={record => {
              return {
                onClick: () => {
                  setSelectedMenuItem(record)
                },
              }
            }}
          />
        </StyledSrollable>
        {!isLoading && !!menuItemResponse?.total && (
          <Pagination
            customClass={customClass}
            config={pagination}
            totalItems={{
              total: menuItemResponse?.total,
            }}
          />
        )}
      </Body>
      <Footer>
        <Button onClick={onClose}> {t('common.cancel')}</Button>
        <Button
          disabled={!selectedMenuItem}
          onClick={() => {
            onOk(selectedMenuItem!)
            onClose()
          }}
          type="primary"
        >
          {t('common.ok')}
        </Button>
      </Footer>
    </Container>
  )
}

const Container = styled.div`
  ${tw`h-full flex flex-col pt-4 gap-4`}
`

const Header = styled.div`
  ${tw`flex justify-between items-center px-8`}
`

const Body = styled.div`
  ${tw`flex-1 flex flex-col justify-center`}
`

const Footer = styled.div`
  border-top: 1px solid ${theme`colors.table.line`};
  ${tw`flex justify-end items-center gap-2 pb-2 pt-2 px-4`}
`

const StyledButton = styled(Button)`
  ${tw`border-none`}
  background: transparent;
  :active,
  :focus,
  :hover {
    background: transparent;
  }
`

const StyledSrollable = styled(Scrollable)`
  height: calc(100vh - 96px - 32px - 64px - 96px - 48px - 32px);
  ${tw`!p-0 !px-8`}
`
