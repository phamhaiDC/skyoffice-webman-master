import { useState } from 'react'
import {
  ControllerRenderProps,
  FormProvider,
  Path,
  useController,
  useForm,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button, DatePicker, Input, Select } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { FilterDef, FilterItem, FilterValue } from './types'

type Props<Model> = {
  filters: FilterDef<Model>
  selectedProperty?: Path<Partial<Model>>
  selectedValue?: any
  onOk: (property: Path<Partial<Model>>, value: any) => void
  onCancel: () => void
}

const AddFilter = <Model,>({
  filters,
  selectedProperty,
  selectedValue,
  onOk,
  onCancel,
}: Props<Model>) => {
  const { t } = useTranslation()
  const formMethods = useForm<FilterValue<Model>>({ mode: 'onChange' })
  const { watch, handleSubmit, control } = formMethods
  const [selectedVal, setSelectedVal] = useState(selectedValue)

  const [currentProperty, setCurrentProperty] = useState<
    Path<Partial<Model>> | undefined
  >(
    selectedProperty ||
      (Object.keys(filters).length
        ? (Object.keys(filters)[0] as Path<Partial<Model>>)
        : undefined)
  )
  const {
    field: { value, onChange, onBlur },
    fieldState: { error, isDirty },
  } = useController({
    control,
    name: currentProperty || ('' as Path<Partial<Model>>),
    rules: { required: true },
  })
  const handleCancel = () => {
    onCancel()
  }
  const handleAdd = handleSubmit(() => {
    if (!currentProperty) {
      return
    }
    onOk(currentProperty, watch(currentProperty))
    handleCancel()
  })

  const handleChangeProperty = (currentProp: typeof currentProperty) => {
    formMethods.reset()
    if (currentProp !== selectedProperty) {
      setSelectedVal(undefined)
    } else {
      setSelectedVal(selectedValue)
    }
    setCurrentProperty(currentProp)
  }

  return (
    <FormProvider {...formMethods}>
      <Container>
        <Select<Path<Partial<Model>>>
          className="w-full"
          placeholder={t('filters.property')}
          options={Object.entries(filters as { [key: string]: FilterItem }).map(
            ([key, filterItem]) => ({
              value: key,
              label: filterItem.label,
            })
          )}
          value={currentProperty}
          onChange={handleChangeProperty}
        />
        <Filter
          disabled={!currentProperty}
          {...{
            ...(filters[currentProperty] as FilterItem),
            value: value || selectedVal,
            onChange,
            onBlur,
          }}
        />
        <Footer>
          <Button onClick={handleCancel}>{t('common.cancel')}</Button>
          <Button
            onClick={handleAdd}
            disabled={!currentProperty || !!error || !isDirty}
            type="primary"
          >
            {t('common.apply')}
          </Button>
        </Footer>
      </Container>
    </FormProvider>
  )
}

export default AddFilter

const Filter = (
  props: FilterItem &
    Pick<ControllerRenderProps, 'value' | 'onChange' | 'onBlur'> & {
      disabled?: boolean
    }
) => {
  const {
    type,
    options,
    placeholder,
    disabled,
    loading,
    value,
    onChange,
    onBlur,
  } = props
  const { t } = useTranslation()

  switch (type) {
    case 'select':
      return (
        <Select
          disabled={disabled || loading}
          className="w-full"
          placeholder={placeholder}
          options={options}
          loading={loading}
          mode="multiple"
          showSearch
          filterOption={(search, option) =>
            (option?.value || '').toString().includes(search) ||
            (option?.label || '').toString().includes(search)
          }
          {...{
            value,
            onChange,
            onBlur,
          }}
        />
      )

    case 'date':
      return (
        <DatePicker
          disabled={disabled}
          className="w-full"
          {...{
            value,
            onChange,
            onBlur,
          }}
        />
      )

    case 'dateRange':
      return (
        <DatePicker.RangePicker
          disabled={disabled}
          className="w-full"
          placeholder={[
            t('common.field.placeholder.dateRange.from'),
            t('common.field.placeholder.dateRange.to'),
          ]}
          {...{
            value,
            onChange,
            onBlur,
          }}
        />
      )

    case 'number':
      return null

    case 'text':
    default:
      return (
        <Input
          disabled={disabled}
          className="w-full"
          {...{ value, onChange, onBlur, placeholder }}
        />
      )
  }
}

const Container = styled.div`
  ${tw`flex flex-col gap-4 w-[20rem]`}
`

const Footer = styled.div`
  ${tw`w-full flex gap-2 justify-end`}
`
