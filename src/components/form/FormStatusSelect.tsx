import { FormItemProps, Select, SelectProps } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { CommonStatus } from '../../models'
import { ControlledFormItem } from './ControlledFormItem'

type Props = {
  name?: string
  formItemProps?: FormItemProps
  selectProps?: SelectProps
}

const FormStatusSelect: React.FC<Props> = ({
  selectProps,
  name = 'status',
  ...rest
}) => {
  return (
    <ControlledFormItem
      {...rest}
      name={name}
      render={({ value, onChange }) => (
        <StyledSelect
          // {...selectProps}
          value={value}
          onChange={onChange}
          size="small"
        >
          {Object.entries(CommonStatus).map(([key, val]) => (
            <StyledSelect.Option key={key} value={+key}>
              <span>{val}</span>
            </StyledSelect.Option>
          ))}
        </StyledSelect>
      )}
    />
  )
}

export default FormStatusSelect

const StyledSelect = styled(Select)`
  .ant-select-selector {
    ${tw`!px-2 rounded-lg`};
  }
`
