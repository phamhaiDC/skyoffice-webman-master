import { ControllerProps } from 'react-hook-form'
import { NumberFormatProps } from 'react-number-format'
import { Button, ButtonProps, FormItemProps, Input, InputProps } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { ControlledFormItem } from './ControlledFormItem'

type Props = {
  name: string
  label?: string
  formItemProps?: FormItemProps
  inputProps?: InputProps
  buttonProps?: ButtonProps & {
    text?: string
  }
  handleClick: Function
} & Omit<ControllerProps, 'render'> &
  Pick<NumberFormatProps, 'customInput'>

const { Search } = Input

const FormInputWithButton: React.FC<Props> = ({
  buttonProps,
  handleClick,
  inputProps,
  ...rest
}) => {
  return (
    <ControlledFormItem
      {...rest}
      render={({ value, onChange, onBlur }) => (
        <div className="flex ">
          <StyledInputSearch
            allowClear
            {...{ value, onChange, onBlur }}
            {...inputProps}
            onSearch={() => handleClick()}
            enterButton={buttonProps?.icon}
          />
        </div>
      )}
    />
  )
}

export default FormInputWithButton

const StyledInputSearch = styled(Search)`
  .ant-input-affix-wrapper {
    &:hover {
      ${tw`!z-[2]`}
    }
  }
  .ant-btn {
    border-color: ${theme`colors.input.line` as string};
    ${tw`bg-white shadow-none`}
    &:hover {
      border-color: ${theme`colors.primary.hover` as string};
    }
  }
  .anticon {
    ${tw`text-black`}
  }
`
