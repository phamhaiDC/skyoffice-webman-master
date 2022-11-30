import { useRef, useState } from 'react'
import { Chart } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import ReactToPrint from 'react-to-print'
import { Button, Tooltip } from 'antd'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
} from 'chart.js'
import styled from 'styled-components'
import tw from 'twin.macro'
import { PrinterOutlined } from '@ant-design/icons'
import { ReportCard } from '../components'
import { FullScreenModal } from '../components/FullScreenModal'

const {
  data: mocks,
} = require('../../../mocks/gethourlysalebyrestaurants.json')

ChartJS.register(
  CategoryScale,
  BarElement,
  LinearScale,
  LineElement,
  LineController,
  PointElement,
  Title,
  Legend
)
const options: React.ComponentProps<typeof Chart>['options'] = {
  plugins: {
    legend: {
      align: 'end',
      position: 'top',
      labels: {
        pointStyle: 'circle',
        usePointStyle: true,
        boxWidth: 8,
        font: { size: 12 },
      },
    },
  },
}

type Data = {
  hourly: string
  restaurant_id: number
  restaurant_name: string
  alt_name: string
  check_count: number
  guest_count: number
  price_sum: number
  pay_sum: number
  calc_percent: number
}

const RevenueByHours = () => {
  const { t } = useTranslation()

  const [visible, setVisible] = useState(false)
  const chartRef = useRef(null)
  const data = (mocks as Data[]).filter(d => d.restaurant_id === 1005879)

  const renderChart = () => (
    <div
      ref={chartRef}
      className="h-full w-full flex items-center justify-center"
    >
      <Chart
        type="line"
        className="my-auto"
        options={options}
        data={{
          labels: Array(new Date().getHours())
            .fill(null)
            .map((_, hour) => `${hour}:00`),
          datasets: [
            {
              type: 'line',
              label: 'Price Sum',
              data: data.map(d => d.price_sum),
              borderColor: 'rgba(229, 49, 26, 0.8)',
              backgroundColor: 'rgba(229, 49, 26, 0.8)',
              borderWidth: 2,
              tension: 0.25,
              order: 1,
            },
            {
              type: 'bar',
              label: 'Revenue',
              data: data.map(d => d.pay_sum),
              backgroundColor: 'rgba(51, 119, 255, 0.8)',
              order: 2,
            },
          ],
        }}
      />
    </div>
  )

  const print = () => (
    <ReactToPrint
      // eslint-disable-next-line react/no-unstable-nested-components
      trigger={() => (
        <Tooltip title={t('dashboard.print')}>
          <StyledButton>
            <PrinterOutlined className="text-xl !flex" />
          </StyledButton>
        </Tooltip>
      )}
      // @ts-ignore
      content={() => chartRef.current}
      documentTitle={t('dashboard.report.revenueByHours')}
    />
  )

  return (
    <ReportCard
      title={t('dashboard.report.revenueByHours')}
      onViewFull={() => setVisible(true)}
      print={print()}
    >
      {renderChart()}
      <FullScreenModal
        title={t('dashboard.report.revenueByHours')}
        visible={visible}
        onClose={() => setVisible(false)}
        print={print()}
      >
        <div className="w-4/5 flex-1 m-auto flex items-center">
          {!!chartRef && renderChart()}
        </div>
      </FullScreenModal>
    </ReportCard>
  )
}

export default RevenueByHours

export const StyledButton = styled(Button)`
  ${tw`flex items-center`};
  padding: 0;
  border-color: transparent;
  :hover,
  :active,
  :focus {
    border-color: transparent;
  }
`
