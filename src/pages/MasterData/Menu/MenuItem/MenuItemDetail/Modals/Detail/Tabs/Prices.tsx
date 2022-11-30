import { useTranslation } from 'react-i18next'
import { Col, Tooltip } from 'antd'
import styled from 'styled-components'
import { QuestionCircleOutlined } from '@ant-design/icons'
import DescriptionText from '@components/DescriptionText'
import FormCheckbox from '@components/form/FormCheckbox'
import { MoneyInput } from '@components/form/FormInput'
import { NoDataContainer } from '@components/modals/Layout'
import { Price } from '@models'
import Scrollable from '../../../../../../../../layout/Scrollable'

type Props = {
  prices?: Price[]
}

const Prices: React.FC<Props> = ({ prices = [] }) => {
  const { t } = useTranslation()

  if (!prices.length) {
    return <NoDataContainer />
  }

  return (
    <Scrollable
      style={{
        maxHeight: 'calc(100vh - 12.125rem)',
      }}
      className="!p-0 !pr-8 !pt-5 !overflow-x-hidden"
    >
      <FormCheckbox
        name="openPrices"
        label={t('modifier.detail.openPrices')}
        formItemProps={{ className: 'mb-0' }}
        description={t('common.price.openPriceDescription')}
      />
      {prices.map((price, index) => (
        <PriceItem key={price.id}>
          <Col span={12} className="pb-4">
            <div className="flex flex-col">
              <span className="font-semibold">
                {price.name}
                <Tooltip title={price.description || price.name}>
                  <QuestionCircleOutlined className="text-gray-400 cursor-help ml-2" />
                </Tooltip>
              </span>
              <DescriptionText description={price.description} />
            </div>
          </Col>
          <Col span={12}>
            <MoneyInput name={`priceTypes.${index}.value`} />
          </Col>
        </PriceItem>
      ))}
    </Scrollable>
  )
}

export default Prices

const PriceItem = styled.div.attrs({
  className: 'flex items-center justify-center w-full h-full',
})``
