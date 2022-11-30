import { Button } from 'antd'
import styled from 'styled-components'
import { theme } from 'twin.macro'
import { ReactComponent as TrashIcon } from '@assets/icons/Trash.svg'
import animateSvgCss from '../../styles/AnimatedSvg'

const StyledButton = styled(Button).attrs({
  className: 'pl-3 flex items-center font-medium',
  shape: 'round',
})``

export const ActionButton = styled(StyledButton)`
  ${animateSvgCss(theme`colors.black`, theme`colors.primary.hover`)}
`

export const DeleteButton = styled(StyledButton).attrs({
  icon: <TrashIcon className="mr-2" />,
  type: 'default',
  danger: true,
})`
  ${animateSvgCss(
    theme`colors.danger.default`,
    theme`colors.danger.hover`
  )}/* svg {
    stroke: black;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  &[disabled] {
    svg {
      stroke: #c8c6c6;
    }
  }
  :not([disabled]) {
    :hover,
    :focus {
      svg {
        stroke: #40a9ff;
      }
    }
  }
  :active {
    svg {
      stroke: #096dd9;
    }
  } */
`
