import { useTranslation } from 'react-i18next'
import { Col, Divider, Row } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { Title } from '@components/elements/Title'
import { DateFilter, HorizontalAverageCard, PercentCard } from '../components'
import HighestRevenueDishes from '../reports/HighestRevenueDishes'
import OrderStatus from '../reports/OrderStatus'
import RevenueByCategories from '../reports/RevenueByCategories'
import RevenueByDays from '../reports/RevenueByDays'
import RevenueByHours from '../reports/RevenueByHours'

const Restaurant: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <Row className="flex flex-col !gap-4">
        <Title>{t('dashboard.restaurant.title')}</Title>
        <DateFilter />
      </Row>
      <Row gutter={32}>
        <Col span={6}>
          <PercentCard
            percent={12}
            isUp
            name={t('dashboard.card.percent.type.receipt')}
            period={{ current: 1123, previous: 0 }}
          />
        </Col>
        <Col span={6}>
          <PercentCard
            percent={22}
            name={t('dashboard.card.percent.type.guest')}
            period={{ current: 3022, previous: 111 }}
          />
        </Col>
        <Col span={6}>
          <PercentCard
            percent={22}
            isUp
            name={t('dashboard.card.percent.type.discount')}
            period={{ current: 23, previous: 1123 }}
          />
        </Col>
        <Col span={6}>
          <PercentCard
            percent={19}
            isUp={false}
            name={t('dashboard.card.percent.type.totalAmount')}
            period={{ current: 123, previous: 143 }}
          />
        </Col>
      </Row>
      <Row gutter={32}>
        <Col span={14}>
          <RevenueByHours />
        </Col>
        <Col span={10}>
          <OrderStatus />
        </Col>
      </Row>
      <Row gutter={32}>
        <Col span={7}>
          <RevenueByDays />
        </Col>
        <Col span={7}>
          <RevenueByCategories />
        </Col>
        <Col span={10}>
          <HighestRevenueDishes />
        </Col>
      </Row>
      <StyledRow>
        <Col span={5}>
          <HorizontalAverageCard
            title={t('dashboard.card.averageGuestPerReceipt')}
            value={1250}
            percent={30}
            isUp
          />
        </Col>
        <CustomDivider />
        <Col span={5}>
          <HorizontalAverageCard
            title={t('dashboard.card.averageRevenuePerReceipt')}
            value={150}
            percent={40}
          />
        </Col>
        <CustomDivider />
        <Col span={5}>
          <HorizontalAverageCard
            title={t('dashboard.card.totalTaxAmount')}
            value={220}
            percent={90}
          />
        </Col>
        <CustomDivider />
        <Col span={5}>
          <HorizontalAverageCard
            title={t('dashboard.card.totalAmountWithoutTax')}
            value={1110}
            percent={10.22}
            isUp
          />
        </Col>
      </StyledRow>
    </Container>
  )
}

export default Restaurant

const Container = styled.div`
  ${tw`px-12 pt-2 pb-8 flex-1 flex flex-col items-stretch bg-white gap-8`}
`

const StyledRow = styled(Row)`
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.08);
  ${tw`py-2 px-4 flex items-center justify-between rounded`}
`

const CustomDivider = () => {
  return (
    <Col span={1} className="h-full flex items-center">
      <Divider type="vertical" className="h-1/2" />
    </Col>
  )
}
