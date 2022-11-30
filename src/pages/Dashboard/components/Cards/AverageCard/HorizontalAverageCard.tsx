import styled from 'styled-components'
import tw from 'twin.macro'
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons'
import ThousandNumber from '@components/elements/ThousandNumber'

type Props = {
  title: string
  value: number
  percent: number
  isUp?: boolean
}

export const HorizontalAverageCard: React.FC<Props> = ({
  title,
  value,
  percent,
  isUp,
}) => {
  return (
    <Container>
      <Title>{title}</Title>
      <div className="flex gap-2 items-center">
        <Value>
          <ThousandNumber value={value} />
        </Value>
        <Percent className={isUp ? 'bg-green-500' : 'bg-red-500'}>
          {isUp ? <CaretUpFilled /> : <CaretDownFilled />}
          {percent}%
        </Percent>
      </div>
    </Container>
  )
}

const Container = styled.div`
  ${tw`flex flex-col gap-3`}
`

const Title = styled.span`
  ${tw`text-sm font-medium leading-5 text-gray-500 capitalize`}
`

const Value = styled.span`
  ${tw`text-base font-bold text-gray-800`}
`

const Percent = styled.div`
  ${tw`flex gap-2 items-center text-gray-100 font-medium text-xs py-1 px-2 rounded-full`}
`
