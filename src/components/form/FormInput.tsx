import { forwardRef } from 'react'
import { ControllerProps } from 'react-hook-form'
import NumberFormat, { NumberFormatProps } from 'react-number-format'
import {
  Button,
  Divider,
  FormItemProps,
  Input,
  InputProps,
  InputRef,
} from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { ControlledFormItem } from './ControlledFormItem'
import FormCheckbox, { Props as CProps } from './FormCheckbox'
import FormSelect, { SelectOption } from './FormSelect'

type Props = {
  name: string
  label?: string
  formItemProps?: FormItemProps
  inputProps?: InputProps
} & Omit<ControllerProps, 'render'> &
  Pick<NumberFormatProps, 'customInput'>

const FormInput: React.FC<Props> = ({ inputProps, ...rest }) => {
  return (
    <ControlledFormItem
      {...rest}
      render={({ value, onChange, onBlur }) => (
        <Input allowClear {...{ value, onChange, onBlur }} {...inputProps} />
      )}
    />
  )
}

export default FormInput

export const FormPassword: React.FC<Props> = ({ inputProps, ...rest }) => {
  return (
    <ControlledFormItem
      {...rest}
      render={({ value, onChange, onBlur }) => (
        <Input.Password
          {...{ value, onChange, onBlur }}
          {...inputProps}
          allowClear
        />
      )}
    />
  )
}

export const MyInput = forwardRef<
  InputRef,
  InputProps & { customSuffix?: React.ReactNode }
>(({ customSuffix, ...props }, ref) => (
  <Input ref={ref} {...props} suffix={customSuffix} />
))

type NumberInputProps = Props & {
  numberFormatProps?: NumberFormatProps
  showUpDown?: boolean
}

export const NumberInput: React.FC<NumberInputProps> = ({
  numberFormatProps,
  showUpDown = false,
  ...props
}) => {
  return (
    <ControlledFormItem
      {...props}
      render={({ value: fieldValue, onChange, onBlur }) => (
        <NumberFormat
          {...numberFormatProps}
          className={`rounded-sm ${showUpDown ? 'py-0 pr-0' : ''}`}
          value={fieldValue}
          onValueChange={({ value }) => onChange(value ? +value : null)}
          onBlur={onBlur}
          allowNegative={false}
          // @ts-ignore
          customInput={props.customInput || MyInput}
          allowClear={!showUpDown}
          customSuffix={
            showUpDown ? (
              <CustonButton
                icon={
                  <div className="flex flex-col">
                    <UpOutlined
                      className="text-[12px] mb-[3px]"
                      onClick={() => onChange(fieldValue ? fieldValue + 1 : 1)}
                    />
                    <Divider className="absolute my-0 top-1/2" />
                    <DownOutlined
                      className="text-[12px] mt-[3px]"
                      onClick={() =>
                        onChange(fieldValue === 0 ? 0 : fieldValue - 1)
                      }
                    />
                  </div>
                }
              />
            ) : undefined
          }
        />
      )}
    />
  )
}

export const NumberInputWithCheckbox: React.FC<{
  checkbox: CProps
  numberInput: NumberInputProps
}> = ({ checkbox, numberInput }) => {
  return (
    <>
      <FormCheckbox
        {...checkbox}
        formItemProps={{ ...checkbox.formItemProps }}
      />
      <NumberInput
        {...numberInput}
        formItemProps={{
          ...numberInput.formItemProps,
          className: `-mt-4 ${numberInput.formItemProps?.className}`,
        }}
      />
    </>
  )
}

export const MoneyInput: React.FC<Props> = props => {
  return (
    <ControlledFormItem
      {...props}
      render={({ value: fieldValue, onChange, onBlur }) => (
        <NumberFormat
          value={fieldValue}
          onValueChange={({ value }) => onChange(value ? +value : null)}
          onBlur={onBlur}
          allowNegative={false}
          customInput={Input}
          allowClear
          thousandSeparator
        />
      )}
    />
  )
}

export const MoneySelect: React.FC<Props> = props => {
  return (
    <ControlledFormItem
      {...props}
      render={({ value: fieldValue, onChange, onBlur }) => (
        <NumberFormat
          value={fieldValue}
          onValueChange={({ value }) => onChange(value ? +value : null)}
          onBlur={onBlur}
          allowNegative={false}
          customInput={Input}
          allowClear
          thousandSeparator
        />
      )}
    />
  )
}
export const SelectWithCheckbox: React.FC<{
  checkbox: CProps
  select: Omit<Props, 'label'>
  options: SelectOption[]
}> = ({ checkbox, select, options }) => {
  return (
    <>
      <FormCheckbox
        {...checkbox}
        formItemProps={{ ...checkbox.formItemProps }}
      />
      <FormSelect
        options={options}
        {...select}
        formItemProps={{
          ...select.formItemProps,
          className: `-mt-4 ${select.formItemProps?.className}`,
        }}
      />
    </>
  )
}

export const MoneyInputWithCheckbox: React.FC<{
  checkbox: CProps
  moneyInput: Omit<Props, 'label'>
}> = ({ checkbox, moneyInput }) => {
  return (
    <>
      <FormCheckbox
        {...checkbox}
        formItemProps={{ ...checkbox.formItemProps }}
      />
      <MoneyInput
        {...moneyInput}
        formItemProps={{
          ...moneyInput.formItemProps,
          className: `-mt-4 ${moneyInput.formItemProps?.className}`,
        }}
      />
    </>
  )
}

const CustonButton = styled(Button).attrs({
  size: 'small',
  className: 'border-none p-0 text-[8px] !h-auto !w-auto',
  // ghost: true,
})`
  ${tw`text-gray-300 hover:text-blue-500`}
  .flex {
    border-left-style: solid;
    ${tw`border-l w-5 relative `}
  }
`
