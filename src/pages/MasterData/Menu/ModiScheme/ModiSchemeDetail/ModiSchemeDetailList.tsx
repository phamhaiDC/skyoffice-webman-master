import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { Button, message } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { ModiScheme, ModiSchemeDetail as ModiSchemeDetailModel } from 'models'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { CheckOutlined, PlusOutlined } from '@ant-design/icons'
import {
  useDeleteModiSchemeDetailsMutation,
  useGetModiSchemeDetailsQuery,
} from '@apis'
import { ReactComponent as EditIcon } from '@assets/icons/Edit.svg'
import { ReactComponent as TrashIcon } from '@assets/icons/Trash.svg'
import Table from '@components/composites/Table'
import AnimateIcon from '@components/elements/AnimateIcon'
import { confirmAsync } from '@utils/modal'
import Scrollable from '../../../../../layout/Scrollable'
import { ModiSchemeDetail } from './Modals'

type Props = {
  modiScheme: Pick<ModiScheme, 'id' | 'useUpperLimit'>
  isUpdatingParent: boolean
  onSaveParent: () => void
}

const ModiSchemeDetailList: React.FC<Props> = ({
  modiScheme,
  isUpdatingParent,
  onSaveParent,
}) => {
  const queryClient = useQueryClient()
  const [visibleModiSchemeDetail, setVisibleModiSchemeDetail] = useState(false)
  const [modiSchemeDetailId, setModiSchemeDetailId] = useState<number>()
  const { t } = useTranslation()
  const { data: modiSchemeDetailsResponse, isLoading } =
    useGetModiSchemeDetailsQuery(
      {
        parentId: modiScheme.id,
      },
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )

  const { mutateAsync: deleteModiSchemeDetails } =
    useDeleteModiSchemeDetailsMutation({
      onSuccess: () => {
        message.success({
          content: t('modiScheme.detail.delete.success'),
        })
        queryClient.invalidateQueries('getModiSchemeDetails')
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const columns: ColumnType<ModiSchemeDetailModel>[] = [
    {
      title: t('common.field.name'),
      width: '30%',
      render: (record: ModiSchemeDetailModel) => (
        <span
          className="cursor-pointer text-blue-500"
          onClick={() => {
            onSaveParent()
            setModiSchemeDetailId(record.id)
            setVisibleModiSchemeDetail(true)
          }}
        >
          {record?.modiGroup?.name || record?.name}
        </span>
      ),
    },
    {
      title: t('modiScheme.detail.upLimit'),
      dataIndex: 'upLimit',
      width: '15%',
      align: 'center',
    },
    {
      title: t('modiScheme.detail.downLimit'),
      dataIndex: 'downLimit',
      width: '15%',
      align: 'center',
    },
    {
      title: t('modiScheme.detail.useUpLimit'),
      width: '15%',
      align: 'center',
      render: (record: ModiSchemeDetailModel) =>
        record.useUpLimit === 1 ? (
          <CheckOutlined className="text-green-500" />
        ) : (
          <CheckOutlined className="text-gray-500" />
        ),
    },
    {
      title: t('modiScheme.detail.useDownLimit'),
      width: '15%',
      align: 'center',
      render: (record: ModiSchemeDetailModel) =>
        record.useDownLimit === 1 ? (
          <CheckOutlined className="text-green-500" />
        ) : (
          <CheckOutlined className="text-gray-500" />
        ),
    },
    {
      width: '10%',
      render: (record: ModiSchemeDetailModel) => (
        <ActionColumn>
          <AnimateIcon
            onClick={() => {
              onSaveParent()
              setModiSchemeDetailId(record.id)
              setVisibleModiSchemeDetail(true)
            }}
            activeColor={theme`colors.blue.500`}
          >
            <EditIcon />
          </AnimateIcon>
          <AnimateIcon
            onClick={confirmAsync(t('common.confirm.delete'), 'danger', () =>
              deleteModiSchemeDetails([record.id])
            )}
            activeColor={theme`colors.red.500`}
          >
            <TrashIcon />
          </AnimateIcon>
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
            onSaveParent()
            setModiSchemeDetailId(undefined)
            setVisibleModiSchemeDetail(true)
          }}
        >
          {t('common.add')}
        </Button>
      </TableHeader>
      <StyledScrollable>
        <Table<ModiSchemeDetailModel>
          columns={columns}
          dataSource={modiSchemeDetailsResponse?.modiSchemeDetails}
          loading={isLoading}
          pagination={false}
          className="!px-0"
        />
      </StyledScrollable>
      {visibleModiSchemeDetail && (
        <ModiSchemeDetail
          visible={visibleModiSchemeDetail}
          isUpdatingParent={isUpdatingParent}
          modiSchemeDetailId={modiSchemeDetailId}
          modiScheme={modiScheme}
          onClose={() => setVisibleModiSchemeDetail(false)}
        />
      )}
    </Container>
  )
}

export default ModiSchemeDetailList

const Container = styled.div`
  ${tw`flex flex-col mb-4 gap-4`}
`

const TableHeader = styled.div`
  ${tw`flex gap-2 justify-between items-center pr-8`}
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
