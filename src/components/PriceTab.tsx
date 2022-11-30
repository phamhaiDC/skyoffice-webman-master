import { useTranslation } from 'react-i18next'
import { Col, Row } from 'antd'
import styled from 'styled-components'
import { ReactComponent as NoDataIcon } from '@assets/icons/EmptyIcon.svg'
import FormCheckbox from '@components/form/FormCheckbox'
import { MoneyInput } from '@components/form/FormInput'
import { Price } from '@models'
import Scrollable from '../layout/Scrollable'
import NoData from './elements/NoData'

type Props = {
  prices: Price[]
}

export const PricesTab: React.FC<Props> = ({ prices }) => {
  const { t } = useTranslation()

  return (
    <>
      <Row>
        <FormCheckbox
          name="openPrices"
          label={t('menuItem.openPrices')}
          formItemProps={{ className: 'mb-0' }}
        />
      </Row>
      <Row>
        <Scrollable
          style={{
            maxHeight: 'calc(100vh - 48px)',
          }}
          className="!p-0 !pr-8"
        >
          {!prices.length ? (
            <NoData icon={<NoDataIcon />} />
          ) : (
            prices.map((price, index) => {
              return (
                <PricesList key={price.id}>
                  <Col span={12} className="pb-4">
                    <span className="font-semibold">{price.name}</span>
                  </Col>
                  <Col span={12}>
                    <MoneyInput name={`priceTypes.${index}.value`} />
                  </Col>
                </PricesList>
              )
            })
          )}
        </Scrollable>
      </Row>
    </>
  )
}

const PricesList = styled.div.attrs({
  className: 'flex items-center justify-center w-full h-full',
})``
