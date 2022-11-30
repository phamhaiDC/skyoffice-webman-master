import { useTranslation } from 'react-i18next'
import { Card, Col, Row } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { Title } from '@components/elements/Title'
import { useGetClassificationsQuery } from '../../../apis'
import { DateFilter, PercentCard, VerticalAverageCard } from '../components'
import HighestRevenueDishes from '../reports/HighestRevenueDishes'
import RevenueByCategories from '../reports/RevenueByCategories'
import RevenueByDays from '../reports/RevenueByDays'
import RevenueByHours from '../reports/RevenueByHours'

const Chain: React.FC = () => {
  const { t } = useTranslation()
  // màn DashBoard hiện tại không call API nên
  useGetClassificationsQuery({ limit: 0 })
  // không check được accessToken -> call tạm API của class

  return (
    <Container>
      <Row className="flex flex-col !gap-4">
        <Title>{t('dashboard.chain.title')}</Title>
        <DateFilter />
      </Row>
      <Row gutter={32}>
        <Col span={6}>
          <PercentCard
            percent={12}
            isUp
            name={t('dashboard.card.percent.type.receipt')}
            period={{ current: 1, previous: 0 }}
          />
        </Col>
        <Col span={6}>
          <PercentCard
            percent={22}
            name={t('dashboard.card.percent.type.guest')}
            period={{ current: 30, previous: 111 }}
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
          <StyledCard>
            <span className="px-4 font-semibold text-base text-gray-1000">
              {t('dashboard.chain.average')}
            </span>
            <div className="h-full flex flex-col gap-4">
              <VerticalAverageCard
                title={t('dashboard.card.averageRevenuePerRestaurant')}
                value={1234}
                isUp
                percent={23}
              />
              <Row gutter={8} className="px-5">
                <Col span={12} className="flex flex-col gap-2">
                  <VerticalAverageCard
                    title={t('dashboard.card.averageGuestPerReceipt')}
                    value={1234}
                    percent={23}
                  />
                  <VerticalAverageCard
                    title={t('dashboard.card.totalTaxAmount')}
                    value={1234}
                    isUp
                    percent={23}
                  />
                </Col>
                <Col span={12} className="flex flex-col gap-2">
                  <VerticalAverageCard
                    title={t('dashboard.card.averageRevenuePerReceipt')}
                    value={1234}
                    isUp
                    percent={23}
                  />
                  <VerticalAverageCard
                    title={t('dashboard.card.totalAmountWithoutTax')}
                    value={1234}
                    percent={23}
                  />
                </Col>
              </Row>
            </div>
          </StyledCard>
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
    </Container>
  )
}

export default Chain

const Container = styled.div`
  ${tw`px-12 pt-2 pb-8 flex-1 flex flex-col items-stretch bg-white gap-8`}
`

const StyledCard = styled(Card)`
  filter: drop-shadow(2px 2px 12px rgba(0, 0, 0, 0.08));
  ${tw`rounded h-full`}

  .ant-card-body {
    ${tw`h-full px-0 py-5 flex flex-col gap-4 justify-between`}

    :before, :after {
      content: unset;
    }
  }
`
