import { PropsWithChildren } from 'react'
import { ConfigProvider, Table as ATable, TableProps } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import NoData from '../elements/NoData'

const Table = <T extends object>(props: PropsWithChildren<TableProps<T>>) => {
  const { loading } = props

  return (
    <ConfigProvider renderEmpty={() => <NoData loading={!!loading} />}>
      <StyledTable<T> {...props} pagination={false} tableLayout="auto" />
    </ConfigProvider>
  )
}

const StyledTable = styled(ATable)`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    ${tw`py-3 px-4`}
  }

  .ant-table-thead > tr > th {
    ${tw`font-semibold`}
  }

  .ant-table-selection-column {
    max-width: 2rem;
  }

  .ant-spin-nested-loading {
    > div:first-child {
      ${tw`absolute h-full w-full`}
      .ant-spin {
        height: unset;
        ${tw`sticky top-1/3 -translate-y-1/2`}
      }
    }
  }

  .ant-table > tr > td {
    color: red;
  }

  th.ant-table-cell-ellipsis {
    ${tw`text-black`}
  }
  .ant-table-cell-ellipsis {
    ${tw`text-blue-500 max-w-[300px]`}
  }

  ${tw`px-8`}
` as typeof ATable

export default Table
