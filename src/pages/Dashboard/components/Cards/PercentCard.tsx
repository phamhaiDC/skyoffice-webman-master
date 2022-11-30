import { useTranslation } from 'react-i18next'
import { Divider } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import ThousandNumber from '../../../../components/elements/ThousandNumber'

type Props = {
  percent: number
  isUp?: boolean
  name: string
  period: {
    current: number
    previous: number
  }
}

export const PercentCard: React.FC<Props> = ({
  percent,
  isUp,
  name,
  period,
}) => {
  const { t } = useTranslation()

  return (
    <Container>
      <div
        className={`text-2xl font-semibold leading-10 flex items-center gap-2 ${
          isUp ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {isUp ? <CaretUpOutlined /> : <CaretDownOutlined />}
        {percent}%
      </div>
      <span className="leading-6 font-medium text-base text-gray-500">
        {name}
      </span>
      <Period>
        <CurrentPeriod>
          <PeriodValue>
            <ThousandNumber value={period.current} />
          </PeriodValue>
          <PeriodName>
            {t('dashboard.card.percent.period.current.title')}
          </PeriodName>
        </CurrentPeriod>
        <StyledDivider type="vertical" />
        <PreviousPeriod>
          <PeriodValue>
            <ThousandNumber value={period.previous} />
          </PeriodValue>
          <PeriodName>
            {t('dashboard.card.percent.period.previous.title')}
          </PeriodName>
        </PreviousPeriod>
      </Period>
    </Container>
  )
}

const Container = styled.div`
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.08);
  ${tw`w-full flex flex-col gap-2 items-center rounded p-4`}
`
const Period = styled.div`
  ${tw`flex justify-center gap-6 pl-[1ch]`}
`

const PeriodName = styled.span`
  width: fit-content;
  ${tw`text-xs font-medium text-gray-500`}
`

const PeriodValue = styled.span`
  width: fit-content;
  ${tw`text-sm font-bold text-gray-800`}
`

const CurrentPeriod = styled.div`
  ${tw`flex flex-col items-end`}
`

const PreviousPeriod = styled.div`
  ${tw`flex flex-col items-start`}
`

const StyledDivider = styled(Divider)`
  height: unset;
  ${tw`text-menu-line m-0`}
`
