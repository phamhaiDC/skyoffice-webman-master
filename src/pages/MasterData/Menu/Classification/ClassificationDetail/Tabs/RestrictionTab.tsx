import { useTranslation } from 'react-i18next'
import { DatePickerWithCheckbox } from '@components/form/FormDatePicker'
import { NumberInputWithCheckbox } from '@components/form/FormInput'

export const RestrictionTab: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      {/* <NumberInput
        name="rightLevel"
        label={t('classification.item.rightLevel')}
      /> */}
      <DatePickerWithCheckbox
        checkbox={{
          name: 'useStartSale',
          label: `${t('classification.item.useStartSale')}`,
        }}
        datePicker={{
          name: 'salesTerms_StartSale',
        }}
      />
      <DatePickerWithCheckbox
        checkbox={{
          name: 'useStopSale',
          label: `${t('classification.item.useStopSale')}`,
        }}
        datePicker={{
          name: 'salesTerms_StopSale',
        }}
      />
      <NumberInputWithCheckbox
        checkbox={{
          name: 'useMinimalRest',
          label: `${t('classification.item.minimalRest')}`,
        }}
        numberInput={{
          name: 'minimalRest',
          numberFormatProps: { decimalScale: 0 },
          showUpDown: true,
        }}
      />
    </>
  )
}
