import { ReactNode } from 'react'
import { TFunction } from 'react-i18next'
import { ColumnType } from 'antd/lib/table'
import styled from 'styled-components'
import { theme } from 'twin.macro'
import { ReactComponent as EditIcon } from '@assets/icons/Edit.svg'
import { ReactComponent as TrashIcon } from '@assets/icons/Trash.svg'
import AnimateIcon from '@components/elements/AnimateIcon'
import { FilterInfo } from '@hooks/useFilter'
import { confirmAsync } from './modal'

const actionColumns = (
  onViewDetail: (id: number) => void,
  onDelete: (id: number) => Promise<any>,
  icon: ReactNode,
  filter: FilterInfo,
  columns: any[],
  t: TFunction
): ColumnType<any>[] => {
  const getSorterTooltip = (sortField: string) => {
    switch (sortField) {
      case 'ascend':
        return t('common.sort.tooltip.descending')
      case 'descend':
        return t('common.sort.tooltip.cancel')
      default:
        return t('common.sort.tooltip.ascending')
    }
  }
  const baseColumn = [
    ...columns.map(column => {
      if (!column.sorter) return column
      return {
        ...column,
        showSorterTooltip: {
          title: getSorterTooltip(filter.sorter[column.dataIndex]),
        },
      }
    }),
  ]

  return icon !== ''
    ? [
        {
          render: () => (
            <div className="flex items-center min-w-fit">{icon}</div>
          ),
          width: '50px',
        },
        ...baseColumn,
        {
          render: (record: any) => (
            <ActionColumn>
              <AnimateIcon
                onClick={() => onViewDetail(record.id)}
                activeColor={theme`colors.blue.500`}
              >
                <EditIcon />
              </AnimateIcon>
              <AnimateIcon
                onClick={confirmAsync(
                  t('common.confirm.delete'),
                  'danger',
                  () => onDelete(record.id)
                )}
                activeColor={theme`colors.red.500`}
              >
                <TrashIcon />
              </AnimateIcon>
            </ActionColumn>
          ),
          width: '10%',
        },
      ]
    : baseColumn
}

export default actionColumns

const ActionColumn = styled.div.attrs({
  className: 'flex gap-4 min-w-fit',
})``
