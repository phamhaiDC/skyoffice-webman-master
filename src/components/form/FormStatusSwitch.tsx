import { ControllerProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormItemProps, Switch, SwitchProps } from 'antd'
import { Status } from 'models/swagger'
import styled from 'styled-components'
import { CommonStatus } from '@models'
import { ControlledFormItem } from './ControlledFormItem'

type Props = {
  name: string
  originalStatus?: Status
  switchProps?: SwitchProps
  formItemProps?: FormItemProps
} & Omit<ControllerProps, 'render'>

const FormStatusSwitch: React.FC<Props> = ({
  originalStatus,
  switchProps,
  ...rest
}) => {
  const { t } = useTranslation()
  const handleChange = (on: boolean, onChange: (value: Status) => void) => {
    if (!onChange) return
    if (on) {
      onChange(3)
      return
    }
    // else: OFF
    switch (originalStatus) {
      // System preset: Do nothing
      case 4:
        break
      case 3:
        onChange(2)
        break
      default:
        onChange(originalStatus || 1)
        break
    }
  }

  return (
    <ControlledFormItem
      {...rest}
      render={({ value, onChange }) => (
        <SwitchComponent>
          <Switch
            {...switchProps}
            checked={[3, 4].includes(value)}
            onChange={e => handleChange(e, onChange)}
          />
          {/* <span>{CommonStatus[(value as Status) || originalStatus]}</span> */}
          <span>{t(`${CommonStatus[3]}`)}</span>
        </SwitchComponent>
      )}
    />
  )
}

export default FormStatusSwitch

const SwitchComponent = styled.div.attrs({
  className: 'flex items-center gap-2',
})``
