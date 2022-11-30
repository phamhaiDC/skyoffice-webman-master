import SimpleBar from 'simplebar-react'
import styled from 'styled-components'
import tw from 'twin.macro'

const Scrollable = styled(SimpleBar)`
  ${tw`m-0 bg-white flex-1 overflow-auto flex px-8 py-2`}
  .simplebar-content-wrapper {
    ${tw`flex`}
  }
  .simplebar-content {
    ${tw`flex flex-1 flex-col`}
  }
`

export default Scrollable
