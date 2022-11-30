import { ControllerProps } from 'react-hook-form'
import { NumberFormatProps } from 'react-number-format'
import { FormItemProps, Input } from 'antd'
import { TextAreaProps } from 'antd/lib/input'
import { ControlledFormItem } from './ControlledFormItem'

type Props = {
  name: string
  label?: string
  formItemProps?: FormItemProps
  areaProps?: TextAreaProps
} & Omit<ControllerProps, 'render'> &
  Pick<NumberFormatProps, 'customInput'>

const FormTextArea: React.FC<Props> = ({ areaProps, ...rest }) => {
  return (
    <ControlledFormItem
      {...rest}
      render={({ value, onChange, onBlur }) => (
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 2 }}
          allowClear
          {...{ value, onChange, onBlur }}
          {...areaProps}
        />
      )}
    />
  )
}

export default FormTextArea
