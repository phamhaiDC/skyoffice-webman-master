import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'antd'
import CollapseTab from '@components/CollapseTab'
import { DatePickerWithCheckbox } from '@components/form/FormDatePicker'
import FormInput, {
  NumberInput,
  NumberInputWithCheckbox,
} from '@components/form/FormInput'
import FormSelect from '@components/form/FormSelect'
import { AddLineMode, PriceMode } from '@models'
import Scrollable from '../../../../../../../../layout/Scrollable'

const Basic: React.FC = () => {
  const formMethods = useForm()
  const { t } = useTranslation()

  const { watch } = formMethods
  // eslint-disable-next-line
  const status = watch('status')

  return (
    <Scrollable
      style={{
        maxHeight: 'calc(100vh - 12.125rem)',
      }}
      className="!p-0 !pr-8 !pt-4 !overflow-x-hidden"
    >
      <Row>
        <Col span={16}>
          <CollapseTab title={t('common.tab.restrictions')}>
            <NumberInputWithCheckbox
              checkbox={{
                name: 'useRestControl',
                label: `${t('menuItem.item.restControl')}`,
              }}
              numberInput={{
                name: 'minRestQnt',
                numberFormatProps: { decimalScale: 0 },
                showUpDown: true,
              }}
            />
            <NumberInputWithCheckbox
              checkbox={{
                name: 'useConfirmQnt',
                label: `${t('menuItem.item.confirmQnt')}`,
              }}
              numberInput={{
                name: 'confirmQnt',
                numberFormatProps: { decimalScale: 0 },
                showUpDown: true,
              }}
            />
            <DatePickerWithCheckbox
              checkbox={{
                name: 'useStartSale',
                label: `${t('menuItem.item.startSale')}`,
              }}
              datePicker={{
                name: 'salesTermsStartSale',
              }}
            />
            <DatePickerWithCheckbox
              checkbox={{
                name: 'useStopSale',
                label: `${t('menuItem.item.stopSale')}`,
              }}
              datePicker={{
                name: 'salesTermsStopSale',
              }}
            />
          </CollapseTab>
          <CollapseTab title={t('common.tab.portions')}>
            <FormSelect
              name="addLineMode"
              label={t('menuItem.item.addLineMode')}
              formItemProps={{
                tooltip: t('menuItem.item.tooltip.addLineMode'),
              }}
              options={Object.entries(AddLineMode).map(([key, value]) => ({
                value: parseInt(key, 10),
                label: t(`${value}`),
              }))}
              selectProps={{
                placeholder: t('menuItem.item.selectAddLineMode'),
              }}
            />
            <FormSelect
              name="priceMode"
              label={t('menuItem.item.priceMode')}
              formItemProps={{
                tooltip: t('menuItem.item.tooltip.priceMode'),
              }}
              options={Object.entries(PriceMode).map(([key, value]) => ({
                value: parseInt(key, 10),
                label: t(`${value}`),
              }))}
              selectProps={{
                placeholder: t('menuItem.item.selectPriceMode'),
              }}
            />
            <FormInput
              name="portionName"
              label={t('menuItem.item.portionName')}
              formItemProps={{
                tooltip: t('menuItem.item.tooltip.portionName'),
              }}
            />
            <FormInput
              name="altPortion"
              label={t('menuItem.item.altPortion')}
              formItemProps={{
                tooltip: t('menuItem.item.tooltip.altPortion'),
              }}
            />
            <NumberInput
              name="portionWeight"
              label={t('menuItem.item.portionWeight')}
              formItemProps={{
                tooltip: t('menuItem.item.tooltip.portionWeight'),
              }}
              numberFormatProps={{
                decimalScale: watch('qntDecDigits') || 0,
              }}
              showUpDown
            />
            <NumberInput
              name="qntDecDigits"
              label={t('menuItem.item.qntDecDigits')}
              formItemProps={{
                tooltip: t('menuItem.item.tooltip.qntDecDigits'),
                className: 'pb-4',
              }}
              numberFormatProps={{ decimalScale: 0 }}
              showUpDown
            />
          </CollapseTab>
        </Col>
        <Col />
      </Row>
    </Scrollable>
  )
}

export default Basic
