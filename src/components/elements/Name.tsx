import { Tooltip, Typography } from 'antd'
import styled from 'styled-components'

const { Text } = Typography

type Props = {
  name?: string
}

const Name: React.FC<Props> = ({ name = '' }) => {
  return (
    <Tooltip title={name}>
      <StyledEllipsis>
        <Text ellipsis>{name}</Text>
      </StyledEllipsis>
    </Tooltip>
  )
}

export default Name

const StyledEllipsis = styled(Text).attrs({
  className: `$tw cursor-pointer max-w-[65%]`,
})``
