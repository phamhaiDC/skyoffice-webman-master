import React from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'antd'
import CollapseTab from '../../../../../../../../components/CollapseTab'
import { DatePickerWithCheckbox } from '../../../../../../../../components/form/FormDatePicker'
import {
  NumberInput,
  NumberInputWithCheckbox,
} from '../../../../../../../../components/form/FormInput'
import Scrollable from '../../../../../../../../layout/Scrollable'

export default function Basic() {
  const { t } = useTranslation()
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
            {/* <NumberInput
                  name="rightLevel"
                  label={t('combo.item.rightLevel')}
                /> */}
            <DatePickerWithCheckbox
              checkbox={{
                name: 'useStartSale',
                label: `${t('combo.item.startSale')}`,
              }}
              datePicker={{
                name: 'salesTerms_StartSale',
              }}
            />
            <DatePickerWithCheckbox
              checkbox={{
                name: 'useStopSale',
                label: `${t('combo.item.stopSale')}`,
              }}
              datePicker={{
                name: 'salesTerms_StopSale',
                formItemProps: {
                  className: 'pb-4',
                },
              }}
            />
          </CollapseTab>
          <CollapseTab title={t('common.tab.portions')}>
            <NumberInputWithCheckbox
              checkbox={{
                name: 'useMaxInOneDish',
                label: `${t('combo.item.useMaxInOneDish')}`,
              }}
              numberInput={{
                name: 'maxInOneDish',
                numberFormatProps: { decimalScale: 0 },
                showUpDown: true,
              }}
            />
            <NumberInput name="weight" label={t('combo.item.weight')} />
          </CollapseTab>
        </Col>
      </Row>
    </Scrollable>
  )
}
