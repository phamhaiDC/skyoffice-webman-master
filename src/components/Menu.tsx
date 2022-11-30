import RCMenu, {
  MenuItem as RCMenuItem,
  MenuItemGroup as RCMenuItemGroup,
} from 'rc-menu'
import styled from 'styled-components'
import tw from 'twin.macro'
import { svgActiveCss, svgDefaultCss } from '../styles/AnimatedSvg'

export const Menu = styled(RCMenu)`
  height: fit-content;
  min-height: 100%;
  border: 0;
  box-shadow: none;
  border-radius: 0;
  padding: 0;

  .rc-menu-item span,
  .rc-menu-item-group-title span:nth-child(2) {
    max-width: 0;
    overflow: hidden;
    transition: max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  &.expanded,
  &.overlay {
    .rc-menu-item span,
    .rc-menu-item-group-title span:nth-child(2) {
      max-width: 100%;
    }
  }
` as typeof RCMenu

export const MenuItem = styled(RCMenuItem)`
  ${tw`cursor-pointer pl-4 h-10 text-gray-800 text-sm font-normal flex items-center`}
  &.rc-menu-item-selected {
    ${tw`text-gray-1000 bg-white`}
    ::before {
      content: '';
      ${tw`absolute left-2 top-2 bottom-2 w-1 rounded-3xl bg-primary-500`}
    }
  }

  svg {
    ${tw`mr-2`}
  }
  ${svgDefaultCss()};
  :hover,
  :focus,
  :active,
  &.rc-menu-item-selected {
    ${tw`text-gray-1000 bg-gray-100`}
    ${svgActiveCss()};
  }

  &.rc-menu-item-selected {
    ${tw`bg-white`}
  }
`

export const MenuItemGroup = styled(RCMenuItemGroup)`
  .rc-menu-item-group-title {
    ${tw`border-0 font-medium text-base text-gray-800 px-4 h-10 my-2 flex`}
  }
`
