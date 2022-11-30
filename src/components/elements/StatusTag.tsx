import { useTranslation } from 'react-i18next'
import { Status } from 'models/swagger'
import styled from 'styled-components'
import tw from 'twin.macro'
import { CommonStatus } from '@models'

type Props = {
  status: Status
}

const statusColor = {
  0: 'bg-red-500',
  1: 'bg-gray-300',
  2: 'bg-yellow-500',
  3: 'bg-green-500',
  4: 'bg-blue-500',
}

const StatusTag: React.FC<Props> = ({ status }) => {
  const { t } = useTranslation()
  return (
    <Container className={statusColor[status]}>
      <span className={`${status === 1 ? 'text-gray-700' : 'text-gray-100'}`}>
        {t(`${CommonStatus[status]}`)}
      </span>
    </Container>
  )
}

export default StatusTag

const Container = styled.div`
  ${tw`px-2 py-0.5 flex items-center justify-center text-xs rounded-full`}
  width: max-content;
`
