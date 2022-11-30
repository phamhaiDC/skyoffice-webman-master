import { css } from 'styled-components'
import { theme } from 'twin.macro'

const none = theme`colors.transparent`
const gray800 = theme`colors.gray.800`
const gray1000 = theme`colors.gray.1000`

export const svgDefaultCss = (color: string = gray800) => css`
  svg {
    *[stroke] {
      stroke: ${color};
    }
    *[fill] {
      fill: ${color};
    }
  }
  svg * {
    transition: fill 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
      stroke 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
`

export const svgActiveCss = (
  activeColor: string = gray1000,
  bgColor?: string
) => css`
  svg[fill='currentColor'] {
    fill: ${activeColor};
  }
  svg[stroke] {
    stroke: ${activeColor};
  }
  svg {
    background-color: ${bgColor || none};
    transition: background-color 0.3s linear;
    *[stroke] {
      stroke: ${activeColor};
      /* stroke: red; */
    }
    *[fill] {
      fill: ${activeColor};
    }
  }
`

const animateSvgCss = (
  color: string = gray800,
  activeColor: string = gray1000,
  bgColor?: string
) => css`
  ${svgDefaultCss(color)};

  :hover,
  :focus,
  :active {
    ${svgActiveCss(activeColor, bgColor)}
  }
`

export default animateSvgCss
