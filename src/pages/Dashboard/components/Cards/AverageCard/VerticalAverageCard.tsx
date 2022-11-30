import { Typography } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons'
import ThousandNumber from '../../../../../components/elements/ThousandNumber'

type Props = {
  title: string
  value: number
  percent: number
  isUp?: boolean
}

export const VerticalAverageCard: React.FC<Props> = ({
  title,
  value,
  percent,
  isUp,
}) => {
  return (
    <Container>
      <Typography.Paragraph
        ellipsis={{ tooltip: title }}
        className="max-w-full"
      >
        <Title>{title}</Title>
      </Typography.Paragraph>
      <Value>
        <ThousandNumber value={value} />
      </Value>
      <Percent className={isUp ? 'bg-green-500' : 'bg-red-500'}>
        {isUp ? <CaretUpFilled /> : <CaretDownFilled />}
        {percent}%
      </Percent>
    </Container>
  )
}

const Container = styled.div`
  ${tw`w-full flex flex-col p-4 justify-center gap-2 items-center bg-bg`}
`

const Title = styled.span`
  ${tw`font-medium text-sm text-gray-500 text-center capitalize`}
`

const Value = styled.span`
  ${tw`font-bold text-base text-gray-800 text-center`}
`

const Percent = styled.div`
  width: fit-content;
  ${tw`flex gap-2 items-center justify-center text-gray-100 font-medium text-xs py-1 px-2 rounded-full`};
`
