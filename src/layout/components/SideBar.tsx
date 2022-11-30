import React, {
  forwardRef,
  PropsWithChildren,
  ReactElement,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import classNames from 'classnames'
import { t } from 'i18next'
import { MenuItemProps, MenuRef } from 'rc-menu'
import SimpleBar from 'simplebar-react'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { ReactComponent as CollapseIcon } from '@assets/icons/CollapseIcon.svg'
import { Menu } from '@components/Menu'
import { svgActiveCss, svgDefaultCss } from '../../styles/AnimatedSvg'
import versionData from '../../version.json'

export type ItemProps = MenuItemProps & {
  label: string
  key: string
  icon?: ReactElement
  group?: boolean
  items?: ItemProps[]
}

export type SideBarRef = {
  setHovering: (_hovering: boolean) => void
}

export type Props = {
  selectedKey?: string
}

const SideBar = forwardRef<SideBarRef, PropsWithChildren<Props>>(
  ({ children, selectedKey }, ref) => {
    const menuRef = useRef<MenuRef>(null)
    // const scrollRef = useRef<SimpleBar>(null)
    const [expanded, setExpanded] = useState(true)
    const [hovering, setHovering] = useState(false)
    useImperativeHandle(ref, () => ({ setHovering }))

    const className = classNames({ expanded, overlay: !expanded && hovering })

    return (
      <Container
        className={className}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <ContentWrapper id="content" className={className}>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {/* <SimpleBar className="h-full" direction="rtl" ref={scrollRef}> */}
            <SimpleBar className="h-full" direction="rtl">
              <Menu
                ref={menuRef}
                className={`flex-1 flex flex-col ${className}`}
                selectedKeys={selectedKey ? [selectedKey] : []}
              >
                {children}
              </Menu>
            </SimpleBar>
          </div>
          <ToggleBar
            onClick={() => {
              setExpanded(prev => !prev)
              setHovering(false)
            }}
            className={className}
          >
            <CollapseIcon />
            <span>
              {`${t('common.version')}`}{' '}
              {`${versionData.buildMajor}.${versionData.buildMinor}.${versionData.buildRevision}`}
            </span>
          </ToggleBar>
        </ContentWrapper>
      </Container>
    )
  }
)

export default SideBar

const Container = styled.div`
  ${tw`relative overflow-visible z-10 w-14`}
  transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  &.expanded {
    width: 200px;
  }
`

const ContentWrapper = styled.div`
  ${tw`h-full flex flex-col bg-menu-bg`}
  border-right: 1px solid ${theme`colors.menu.line` as string};
  width: 56px;
  transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  &.expanded,
  &.overlay {
    width: 200px;
  }
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
`

const ToggleBar = styled.div`
  ${tw`h-10 w-full flex items-center pl-4 cursor-pointer overflow-hidden select-none`}
  border-top: 1px solid ${theme`colors.menu.line` as string};

  ${svgDefaultCss()};
  :hover,
  :focus,
  :active {
    ${tw`text-gray-1000 bg-gray-100`}
    ${svgActiveCss()}
  }

  svg {
    ${tw`mr-2`}
    transform: rotate(180deg);
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  span {
    max-width: 0px;
    overflow: hidden;
    white-space: nowrap;
    transition: max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  &.expanded {
    svg {
      transform: rotate(0);
    }
  }
  &.expanded,
  &.overlay {
    span {
      max-width: 100%;
    }
  }
`
