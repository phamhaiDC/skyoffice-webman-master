import { useEffect, useState } from 'react'
import { Status } from '../models/swagger'
import { useTablesStore } from '../store'

type SortType = 'ascend' | 'descend' | 'none'

export type Sorter = {
  [key: string]: SortType
}

type Props = {
  goToFirstPage: () => void
}

export type FilterInfo = {
  sorter: Sorter
  setSearch: (_search: string) => void
  setSorter: (sorter: Sorter) => void
  search?: string
  sortBy?: string
  status: Status[]
}

const convertSortBy = (sorter: Sorter) =>
  Object.keys(sorter).length
    ? Object.keys(sorter)
        .filter(key => sorter[key] !== 'none')
        .map(key => `${key} ${sorter[key]?.replace('end', '')}`)
        .join(',')
    : undefined

const useFilter = ({ goToFirstPage }: Props): FilterInfo => {
  const [search, setSearch] = useState<string>('')
  const [sorter, setSorter] = useState<Sorter>({})
  const status = useTablesStore(state => state.status)

  useEffect(() => {
    goToFirstPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return {
    search,
    sorter,
    sortBy: convertSortBy(sorter),
    setSearch: _search => {
      goToFirstPage()
      setSearch(_search)
    },
    setSorter,
    status,
  }
}

export default useFilter
