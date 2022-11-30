import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { useQueryClient } from 'react-query'
import { Button, ConfigProvider, message } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { Discount, DiscountDetail as DiscountDetailModel } from 'models'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  useDeleteDiscountDetailsMutation,
  useGetDiscountDetailsQuery,
} from '@apis'
import {
  ReactComponent as AmountUp,
  ReactComponent as PercentUp,
} from '@assets/icons/CurrencyIcon.svg'
import {
  ReactComponent as AmountDown,
  ReactComponent as PercentDown,
} from '@assets/icons/DiscountIcon.svg'
import { ReactComponent as EditIcon } from '@assets/icons/Edit.svg'
import { ReactComponent as TrashIcon } from '@assets/icons/Trash.svg'
import Table from '@components/composites/Table'
import AnimateIcon from '@components/elements/AnimateIcon'
import NoData from '@components/elements/NoData'
import { down, up } from '@utils/array'
import Scrollable from '../../../../../layout/Scrollable'
import { confirmAsync } from '../../../../../utils/modal'
import { DiscountDetailInfo } from './Modals'

type Props = {
  discount: Discount
  isUpdatingParent: boolean
  onSaveDiscount: () => void
}

export const DiscountDetailList: React.FC<Props> = ({
  discount,
  isUpdatingParent,
  onSaveDiscount,
}) => {
  const [visibleDiscountDetailInfo, setVisibleDiscountDetailInfo] =
    useState(false)
  const [selectedDiscountDetailId, setSelectedDiscountDetailId] =
    useState<number>()
  const [discountDetailList, setDiscountDetailList] =
    useState<DiscountDetailModel[]>()

  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { data: discountDetailsResponse, isLoading } =
    useGetDiscountDetailsQuery(
      {
        parentId: discount.id,
      },
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )
  const { mutateAsync: deleteDiscountDetails } =
    useDeleteDiscountDetailsMutation({
      onSuccess: () => {
        message.success({
          content: t('discount.detail.delete.success'),
        })
        queryClient.invalidateQueries('getDiscountDetails')
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  useEffect(() => {
    setDiscountDetailList(discountDetailsResponse?.discountDetails)
  }, [discountDetailsResponse])

  const renderIconDiscount = useMemo(() => {
    if (discount.mode === 0 && discount.countType === 1) return <PercentDown />
    if (discount.mode === 0 && discount.countType === 0) return <AmountDown />
    if (discount.mode === 1 && discount.countType === 1) return <PercentUp />
    return <AmountUp />
  }, [discount])

  const columns: ColumnType<DiscountDetailModel>[] = [
    {
      width: '7%',
      render: () => (
        <div className="flex justify-center min-w-fit !w-full">
          {renderIconDiscount}
        </div>
      ),
    },
    {
      title:
        discount.countType === 1
          ? t('discount.detail.percent')
          : t('discount.detail.amount'),
      render: (_, record: DiscountDetailModel) => (
        <span>
          {discount.countType === 1 ? (
            `${record.percent}%`
          ) : (
            <NumberFormat
              value={record.amount}
              displayType="text"
              thousandSeparator
            />
          )}
        </span>
      ),
    },
    {
      width: '20%',
      render: (_, record: DiscountDetailModel, index) => (
        <ActionColumn>
          <AnimateIcon
            onClick={() => {
              onSaveDiscount()
              setSelectedDiscountDetailId(record.id)
              setVisibleDiscountDetailInfo(true)
            }}
            activeColor={theme`colors.blue.500`}
          >
            <EditIcon />
          </AnimateIcon>
          <AnimateIcon
            onClick={confirmAsync(t('common.confirm.delete'), 'danger', () =>
              deleteDiscountDetails([record.id])
            )}
            activeColor={theme`colors.red.500`}
          >
            <TrashIcon />
          </AnimateIcon>
          {index !== 0 && (
            <AnimateIcon
              activeColor={theme`colors.blue.500`}
              onClick={() =>
                setDiscountDetailList(up(discountDetailList || [], index))
              }
            >
              <ArrowUpOutlined />
            </AnimateIcon>
          )}
          {index !== (discountDetailList?.length || 0) - 1 && (
            <AnimateIcon
              activeColor={theme`colors.red.500`}
              onClick={() =>
                setDiscountDetailList(down(discountDetailList || [], index))
              }
            >
              <ArrowDownOutlined />
            </AnimateIcon>
          )}
        </ActionColumn>
      ),
    },
  ]

  return (
    <Container>
      <TableHeader>
        <TableTitle />
        <Button
          icon={<PlusOutlined />}
          type="primary"
          shape="round"
          onClick={() => {
            onSaveDiscount()
            setSelectedDiscountDetailId(undefined)
            setVisibleDiscountDetailInfo(true)
          }}
          disabled={isUpdatingParent}
        >
          {t('common.add')}
        </Button>
      </TableHeader>
      <StyledScrollable>
        <ConfigProvider
          renderEmpty={() => <NoData loading={isLoading || isUpdatingParent} />}
        >
          <Table<DiscountDetailModel>
            columns={columns}
            dataSource={discountDetailList?.map(item => ({
              ...item,
              key: item.id,
            }))}
            loading={isLoading || isUpdatingParent}
            pagination={false}
            className="!px-0"
          />
        </ConfigProvider>
      </StyledScrollable>
      {visibleDiscountDetailInfo && (
        <DiscountDetailInfo
          visible={visibleDiscountDetailInfo}
          discount={discount}
          onClose={() => setVisibleDiscountDetailInfo(false)}
          discountDetailId={selectedDiscountDetailId}
          classificationId={discount?.classification?.id}
          isUpdatingParent={isLoading}
        />
      )}
    </Container>
  )
}

const Container = styled.div`
  ${tw`flex flex-col mb-4`}
`

const TableHeader = styled.div`
  ${tw`flex gap-2 justify-between items-center mb-4 pr-8`}
`

const TableTitle = styled.div`
  ${tw`flex items-center gap-2`}
`

const ActionColumn = styled.div`
  ${tw`flex gap-4 w-full`}
`

const StyledScrollable = styled(Scrollable)`
  height: calc(100vh - 16.375rem);
  ${tw`pl-0 pr-8 py-0 overflow-x-hidden`}
`
