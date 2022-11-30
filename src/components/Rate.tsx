import { ReactNode } from 'react'
import { Rate as ARate } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'

type Props = {
  rate?: number
  icon?: ReactNode
}

const Rate: React.FC<Props> = ({ rate = 0, icon }) => {
  return (
    <Container>
      {icon}
      <ARate value={rate} allowHalf className="text-base" />
    </Container>
  )
}

export default Rate

const Container = styled.div`
  ${tw`flex gap-2 items-center`}
`
