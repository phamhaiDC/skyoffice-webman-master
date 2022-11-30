import { Tabs as AntTabs } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'

const Tabs = styled(AntTabs)`
  .ant-tabs-nav {
    width: 94%;
    ${tw`mb-6 flex`}
    &::before {
      width: 106%;
    }
    .ant-tabs-tab {
      ${tw`p-0 mb-2`}
    }
  }

  .ant-tabs-tab-btn {
    ${tw`text-gray-500 font-semibold text-sm uppercase pt-[2px]`}
  }

  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      ${tw`text-gray-800`}
    }
  }

  .ant-tabs-ink-bar {
    ${tw`bg-red-500 !h-[3px] rounded-t-full`}
  }
`

export default Tabs

export const ModalTabs = styled(Tabs)`
  ${tw`!h-full pt-2`}

  .ant-tabs-content {
    ${tw`!h-full`}
  }

  .ant-tabs-nav {
    ${tw`pl-8 mb-0`}
  }

  .ant-tabs-content-holder {
    ${tw`pl-8 w-full h-full`}
  }

  .ant-tabs-nav-operations {
    .ant-tabs-nav-more {
      ${tw`cursor-pointer hover:text-blue-500`}
      ${tw`px-4 pt-0`}
    }
  }
`
