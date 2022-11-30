import { useTranslation } from 'react-i18next'
import { Pagination as APagination } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { PaginationInfo } from '../hooks/usePagination'

type Props = {
  totalItems: {
    total?: number
    selected?: number
  }
  config: PaginationInfo
  customClass?: string
}

const Pagination: React.FC<Props> = ({ totalItems, config, customClass }) => {
  const { t } = useTranslation()

  return (
    <Container className={`py-4 ${customClass}`}>
      <div className="flex-1">
        <span>
          {`${totalItems.selected ? t('common.selected') : t('common.total')} ${
            totalItems.selected || totalItems.total || 0
          }`}{' '}
          <span className="lowercase">{t('common.items')}</span>
        </span>
      </div>
      <APagination {...config} />
      <div className="flex-1" />
    </Container>
  )
}

export default Pagination

const Container = styled.div`
  ${tw`w-full flex items-center justify-between px-8  gap-4`}
`
