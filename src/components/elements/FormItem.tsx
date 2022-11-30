import { Form } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'

const FormItem = styled(Form.Item)`
  ${tw`font-semibold mb-4`}

  .ant-form-item-control-input {
    min-height: 24px;
  }

  .ant-form-item-label {
    padding-bottom: 0.25rem;
    ${tw`text-gray-900`}
  }

  .ant-form-item-label {
    > label {
      height: auto;
    }
  }

  .ant-form-item-required:before {
    display: none !important;
  }

  .ant-form-item-tooltip {
    padding-left: 0.25rem !important;
  }

  .ant-form-item-extra {
    padding-top: 4px;
    font-size: 12px;
    font-weight: 400;
  }
`

export default FormItem
