import { PropsWithChildren, useState } from 'react'
import { Divider as ADivider } from 'antd'
import classNames from 'classnames'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { ReactComponent as CaretRightFilledIcon } from '@assets/icons/CaretRightFilled.svg'

type Props = PropsWithChildren<{
  title: string
}>

const CollapseTab: React.FC<Props> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <StyledDivider>
        <span
          onClick={() => setExpanded(!expanded)}
          className={classNames({
            flex: true,
            'items-center': true,
            'gap-2': true,
            expanded,
          })}
        >
          {title}
          <CaretRightFilledIcon />
        </span>
      </StyledDivider>
      {expanded && children}
    </>
  )
}

export default CollapseTab

const StyledDivider = styled(ADivider).attrs({
  orientation: 'left',
  plain: true,
  className: '!mt-0 !font-bold',
})`
  &.ant-divider-horizontal {
    ::before,
    ::after {
      position: unset;
    }
  }

  .ant-divider-inner-text {
    ${tw`cursor-pointer  hover:text-blue-500`}
  }

  .ant-divider-inner-text {
    ${tw`pl-0`}
    span {
      color: ${theme`colors.gray.800` as string};
    }
    svg {
      transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      ${tw`text-gray-400`}
    }
    .expanded {
      svg {
        transform: rotate(90deg);
      }
    }
  }

  ::before {
    ${tw`!w-0`}
  }
`
