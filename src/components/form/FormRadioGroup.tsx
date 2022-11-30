import { ControllerProps } from 'react-hook-form'
import { FormItemProps, Radio, RadioGroupProps, Typography } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { ControlledFormItem } from './ControlledFormItem'

const { Button, Group } = Radio
const { Paragraph } = Typography

type Option = {
  value: any
  label: string
}

export type Props = {
  name: string
  options: Option[]
  formItemProps?: FormItemProps
  radioGroupProps?: RadioGroupProps
} & Omit<ControllerProps, 'render'>

const FormRadioGroup: React.FC<Props> = ({
  options,
  radioGroupProps,
  ...rest
}) => {
  return (
    <ControlledFormItem
      {...rest}
      render={({ value, onChange }) => (
        <StyledRadioGroup
          {...radioGroupProps}
          value={value}
          onChange={onChange}
        >
          {options.map(option => (
            <StyledRadioButton value={option.value}>
              <Paragraph
                ellipsis={{ tooltip: option.label }}
                className="max-w-[125px]"
              >
                {option.label}
              </Paragraph>
            </StyledRadioButton>
          ))}
        </StyledRadioGroup>
      )}
    />
  )
}

export default FormRadioGroup

const StyledRadioGroup = styled(Group).attrs({
  // size: 'large',
})`
  ${tw`w-full mt-2 flex`}

  .ant-radio-button-wrapper {
    ${tw`rounded-sm`}
  }
`

const StyledRadioButton = styled(Button)`
  ${tw`flex-1 text-center text-gray-800 font-normal`}
`
