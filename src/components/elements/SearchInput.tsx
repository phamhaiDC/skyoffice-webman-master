import { Input } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'

const SearchInput = styled(Input.Search)`
  .ant-input-group {
    .ant-input-affix-wrapper {
      :not(:last-child) {
        ${tw`rounded-l-full`}
      }
    }

    .ant-input-group-addon {
      :last-child {
        .ant-input-search-button {
          ${tw`rounded-r-full`}
        }
      }
    }
  }
`

export default SearchInput
