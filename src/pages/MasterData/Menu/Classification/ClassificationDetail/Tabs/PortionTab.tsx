import { useTranslation } from 'react-i18next'
import FormCheckbox from '@components/form/FormCheckbox'
import FormInput, {
  NumberInput,
  NumberInputWithCheckbox,
} from '@components/form/FormInput'
import FormSelect from '@components/form/FormSelect'
import { AddLineMode, PriceMode } from '@models'

export const PortionTab: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <FormInput
        name="massAltName"
        label={t('classification.item.massAltName')}
      />
      <FormInput name="massName" label={t('classification.item.massName')} />
      <NumberInput
        name="quantityPrecision"
        label={t('classification.item.quantityPrecision')}
      />
      <FormSelect
        name="addLineMode"
        label={t('classification.item.addLineMode')}
        selectProps={{
          placeholder: t('classification.item.selectAddLineMode'),
        }}
        options={Object.entries(AddLineMode).map(([key, value]) => ({
          value: parseInt(key, 10),
          label: value,
        }))}
      />
      <FormSelect
        name="priceMode"
        label={t('classification.item.priceMode')}
        selectProps={{
          placeholder: t('classification.item.priceMode'),
        }}
        options={Object.entries(PriceMode).map(([key, value]) => ({
          value: parseInt(key, 10),
          label: value,
        }))}
      />
      <NumberInputWithCheckbox
        checkbox={{
          name: 'useConfirmQuality',
          label: `${t('classification.item.useConfirmQuality')}`,
        }}
        numberInput={{
          name: 'confirmQuality',
          numberFormatProps: { decimalScale: 0 },
          showUpDown: true,
        }}
      />
      <FormCheckbox name="dontPack" label={t('classification.item.dontPack')} />
    </>
  )
}
