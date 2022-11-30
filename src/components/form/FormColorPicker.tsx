import { ControllerProps } from 'react-hook-form'
import { FormItemProps, Input, InputProps } from 'antd'
import { ControlledFormItem } from './ControlledFormItem'

type Props = {
  name: string
  label?: string
  formItemProps?: FormItemProps
  inputProps?: InputProps
} & Omit<ControllerProps, 'render'>

const FormColorPicker: React.FC<Props> = ({ label, inputProps, ...rest }) => {
  return (
    <ControlledFormItem
      {...rest}
      render={({ value, onChange, onBlur }) => (
        <div className="flex flex-col items-start gap-1">
          <span className="font-normal">{label}</span>
          <Input
            {...{ value, onChange, onBlur }}
            {...inputProps}
            type="color"
            className="w-1/2"
          />
        </div>
      )}
    />
  )
}

export default FormColorPicker
