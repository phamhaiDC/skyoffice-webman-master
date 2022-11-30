import { PropsWithChildren } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import animateSvgCss from '../../styles/AnimatedSvg'

type Props = PropsWithChildren<{
  onClick?: () => void
  color?: string
  activeColor?: string
  bgColor?: string
}>

const AnimateIcon: React.FC<Props> = ({
  onClick,
  color,
  activeColor,
  bgColor,
  children,
}) => {
  return (
    <StyledAnimateIcon {...{ color, activeColor, bgColor }} onClick={onClick}>
      {children}
    </StyledAnimateIcon>
  )
}

const StyledAnimateIcon = styled.span<Props>`
  width: fit-content;
  ${tw`cursor-pointer flex`}
  ${props => animateSvgCss(props.color, props.activeColor, props.bgColor)}
`

export default AnimateIcon
