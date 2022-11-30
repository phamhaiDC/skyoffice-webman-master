import { Upload as AUpload } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'

const Upload = styled(AUpload).attrs({
  listType: 'picture-card',
  maxCount: 1,
  accept: 'image/png, image/jpeg',
})`
  ${tw`w-full flex justify-center`}

  .ant-upload-select-picture-card, .ant-upload-list-item-list-type-picture-card {
    ${tw`rounded-lg`}
  }
`

export default Upload
