import { useState } from 'react'
import { TablePaginationConfig } from 'antd'
import { useTablesStore } from '../store'

export type PaginationInfo = {
  setTotal: (total: number) => void
  limit: number
  offset: number
  setOffset: (_offset: number) => void
} & TablePaginationConfig

const usePagination = (
  // limit = 10,
  options?: TablePaginationConfig
): PaginationInfo => {
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState<number>()
  const [limit, setLimit] = useState(useTablesStore(store => store.limit) || 10)

  const setLocalLimit = useTablesStore(store => store.setLimit)

  return {
    ...options,
    total,
    pageSize: limit,
    current: Math.floor(offset / limit) + 1,
    onChange: (page, pageSize) => setOffset((page - 1) * pageSize),
    setTotal,
    limit,
    offset,
    position: ['bottomCenter'],
    setOffset,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50],
    onShowSizeChange: (_, size) => {
      setLimit(size)
      setLocalLimit(size)
    },
  }
}

export default usePagination
