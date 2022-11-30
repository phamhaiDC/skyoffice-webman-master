import { ControllerProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DatePicker, DatePickerProps, FormItemProps } from 'antd'
import moment from 'moment'
import { ControlledFormItem } from './ControlledFormItem'
import FormCheckbox, { Props as CProps } from './FormCheckbox'

type Props = {
  name: string
  label?: string
  formItemProps?: FormItemProps
  datePickerProps?: DatePickerProps
} & Omit<ControllerProps, 'render'>

const FormDatePicker: React.FC<Props> = ({ datePickerProps, ...rest }) => {
  const { t } = useTranslation()

  return (
    <ControlledFormItem
      {...rest}
      render={({ value, onChange, onBlur }) => (
        <DatePicker
          {...{
            value: value ? moment(value, 'YYYY-MM-DD') : undefined,
            onChange,
            onBlur,
          }}
          {...datePickerProps}
          allowClear
          placeholder={t('common.selectDate')}
        />
      )}
    />
  )
}

export default FormDatePicker

export const DatePickerWithCheckbox: React.FC<{
  checkbox: CProps
  datePicker: Omit<Props, 'label'>
}> = ({ checkbox, datePicker }) => {
  return (
    <>
      <FormCheckbox
        {...checkbox}
        formItemProps={{ ...checkbox.formItemProps }}
      />
      <FormDatePicker
        {...datePicker}
        formItemProps={{
          ...datePicker.formItemProps,
          className: `-mt-4 ${datePicker.formItemProps?.className}`,
        }}
        datePickerProps={{
          ...datePicker.datePickerProps,
          className: `w-full ${datePicker.datePickerProps?.className}`,
        }}
      />
    </>
  )
}
