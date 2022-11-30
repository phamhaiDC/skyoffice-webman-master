import { ControllerProps } from 'react-hook-form'
import { Checkbox, CheckboxProps, FormItemProps, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Bit } from '@models'
import DescriptionText from '../DescriptionText'
import { ControlledFormItem } from './ControlledFormItem'

export type Props = {
  name: string
  label?: string
  description?: string
  tooltip?: string
  formItemProps?: FormItemProps
  checkboxProps?: CheckboxProps
  labelStyle?: string
} & Omit<ControllerProps, 'render'>

const FormCheckbox: React.FC<Props> = ({
  label,
  description,
  tooltip,
  checkboxProps,
  labelStyle,
  ...rest
}) => {
  return (
    <ControlledFormItem
      {...rest}
      render={({ value, onChange, onBlur }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center font-normal pb-1">
            <Checkbox
              {...{
                checked: value,
                onChange: e => onChange(+e.target.checked as Bit),
                onBlur,
              }}
              {...checkboxProps}
            >
              <span className={labelStyle}>{label}</span>
            </Checkbox>
            {!!tooltip && (
              <Tooltip title={tooltip}>
                <QuestionCircleOutlined className="text-gray-500 cursor-help" />
              </Tooltip>
            )}
          </div>
          {!!description && <DescriptionText description={description} />}
        </div>
      )}
    />
  )
}

export default FormCheckbox
