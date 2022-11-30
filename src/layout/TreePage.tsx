import React, { PropsWithChildren } from 'react'
import { Button, Tree } from 'antd'
import { DataNode } from 'antd/lib/tree'
import SimpleBar from 'simplebar-react'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { PlusOutlined } from '@ant-design/icons'
import { ReactComponent as FolderIcon } from '@assets/icons/FolderIcon.svg'
import { ReactComponent as SwitcherIcon } from '@assets/icons/SwitcherIcon.svg'
import Spin from '@components/elements/Spin'
import { Title } from '@components/elements/Title'
import useWindowSize from '@hooks/useWindowSize'
import animateSvgCss, {
  svgActiveCss,
  svgDefaultCss,
} from '../styles/AnimatedSvg'

const { DirectoryTree } = Tree

type Props = PropsWithChildren<{
  title: string
  selectedKeys: React.Key[]
  selectedTreeKeys: React.Key[]
  onKeySelect: (selectedKeys: React.Key[]) => void
  onAddTreeItem: () => void
  treeData?: DataNode[]
}>

export const TreePage: React.FC<Props> = ({
  title,
  treeData,
  selectedKeys,
  selectedTreeKeys,
  onKeySelect,
  onAddTreeItem,
  children,
}) => {
  const { height: windowHeight } = useWindowSize()

  return (
    <Page className="h-full w-full flex flex-row">
      <TreeContainer>
        <TitleBar>
          <Title>
            {title}
            <Button
              shape="circle"
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={onAddTreeItem}
            />
          </Title>
        </TitleBar>
        <div className="flex-1 overflow-auto">
          <TreeContent>
            {treeData ? (
              <StyledTree
                switcherIcon={<SwitcherIcon />}
                icon={<FolderIcon />}
                onSelect={onKeySelect}
                treeData={treeData}
                defaultExpandedKeys={selectedKeys}
                defaultSelectedKeys={selectedTreeKeys}
                selectedKeys={selectedKeys}
                expandAction="doubleClick"
                height={windowHeight && windowHeight - 104}
              />
            ) : (
              <Spin className="my-auto" />
            )}
          </TreeContent>
        </div>
      </TreeContainer>
      <Container>{children}</Container>
    </Page>
  )
}

const Container = styled.div.attrs({
  className: 'flex flex-col flex-1',
})`
  border-left: 1px solid ${theme`colors.menu.line`};
`

const TitleBar = styled.div.attrs({
  className: 'px-8 h-14 flex items-center relative',
})`
  ::before {
    content: '';
    display: block;
    height: 1px;
    background-color: ${theme`colors.menu.line`};
    ${tw`absolute left-0 bottom-0 right-0`}
  }
`

const TreeContainer = styled.div.attrs({
  className: 'bg-menu-bg flex flex-col h-full',
})`
  border-bottom: 1px solid ${theme`colors.menu.line`};
`

const TreeContent = styled('div').attrs({
  className: 'h-full overflow-hidden flex-1 flex flex-col pb-4',
})`
  width: 300px;
`

const StyledTree = styled(DirectoryTree)`
  background-color: ${theme`colors.menu.bg`};

  .ant-tree-list-holder-inner {
    ${tw`pb-4`}/* padding-bottom: 16px; */
  }

  .item {
    :hover,
    :focus,
    :active {
      .dropdown {
        visibility: visible;
      }
    }
  }

  .item {
    :not(:hover) {
      .dropdown {
        visibility: hidden;
      }
    }
  }

  .ant-tree-treenode {
    ${tw`relative h-10 flex items-center pb-0 font-normal text-sm text-gray-800`}
    ${animateSvgCss()};

    ::before {
      ${tw`!bottom-0`}
    }

    .ant-tree-title {
      ${tw`ml-1`}
    }

    .ant-tree-switcher {
      ${tw`flex items-center justify-end w-8`}
      ${svgDefaultCss(theme`colors.gray.500`)}
        svg {
        transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      &.ant-tree-switcher_open {
        svg {
          transform: rotate(90deg);
        }
      }
    }

    .ant-tree-node-content-wrapper {
      ${tw`pl-0 table table-fixed w-full`}

      > span {
        ${tw`table-cell align-middle`}
        svg {
          ${tw`align-middle`}
        }
      }

      .ant-tree-title {
        ${tw`pl-1 pr-10 overflow-hidden whitespace-nowrap overflow-ellipsis`}
      }
    }
  }

  .ant-tree-treenode-selected {
    ${tw`text-gray-1000`}
    ${svgActiveCss()}
      ::before {
      ${tw`!bottom-0 !bg-white`}
    }
    ::after {
      content: '';
      ${tw`absolute top-0 bottom-0 right-0 bg-primary-500`}
      width: 2px;
    }
  }

  .ant-tree-node-selected {
    color: ${theme`colors.gray.1000` as string} !important;
  }
`

const Page = styled(SimpleBar)`
  ${tw`m-0 bg-white flex-1 overflow-auto flex`}
  .simplebar-content-wrapper {
    ${tw`flex`}
  }
  .simplebar-content {
    ${tw`flex flex-1`}
  }
`
