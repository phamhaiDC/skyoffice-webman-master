import { PropsWithChildren, useMemo } from 'react'
import {
  Controller,
  ControllerProps,
  ControllerRenderProps,
  useFormContext,
} from 'react-hook-form'
import { FormItemProps } from 'antd'
import { LabelTooltipType } from 'antd/lib/form/FormItemLabel'
import FormItem from '../elements/FormItem'
import FormItemLabel from '../elements/FormItemLabel'

type Props = PropsWithChildren<
  {
    name: string
    label?: string
    formItemProps?: FormItemProps
    render: (
      props: Pick<ControllerRenderProps, 'value' | 'onChange' | 'onBlur'>
    ) => React.ReactNode
  } & Omit<ControllerProps, 'render'>
>

const getTooltip = (tooltipProps: LabelTooltipType) => {
  switch (typeof tooltipProps) {
    case 'object':
      return {
        ...tooltipProps,
      }
    case 'string':
      return { title: tooltipProps }
    default:
      return tooltipProps
  }
}

export const ControlledFormItem: React.FC<Props> = ({
  name,
  label,
  formItemProps = {},
  render,
  ...controllerProps
}) => {
  const { control } = useFormContext()

  const tooltip = useMemo(() => {
    const tooltipProps = formItemProps.tooltip
    return getTooltip(tooltipProps)
  }, [formItemProps.tooltip])

  return (
    <Controller
      control={control}
      name={name}
      {...controllerProps}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <FormItem
          label={
            label ? (
              <FormItemLabel label={label} required={formItemProps.required} />
            ) : undefined
          }
          {...formItemProps}
          // @ts-ignore
          tooltip={tooltip}
          validateStatus={error ? 'error' : 'validating'}
          help={error?.message}
        >
          {render({ value, onChange, onBlur })}
        </FormItem>
      )}
    />
  )
}
