import { useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import ReactToPrint from 'react-to-print'
import { Tooltip } from 'antd'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Title,
} from 'chart.js'
import { theme } from 'twin.macro'
import { PrinterOutlined } from '@ant-design/icons'
import { ReportCard } from '../components'
import { FullScreenModal } from '../components/FullScreenModal'
import { StyledButton } from './RevenueByHours'

const {
  data: mocks,
} = require('../../../mocks/gethourlysalebyrestaurants.json')

ChartJS.register(
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement,
  Title,
  Legend
)
const options: React.ComponentProps<typeof Bar>['options'] = {
  responsive: true,
  // aspectRatio: 1,
  scales: { y: {} },
  plugins: {
    legend: {
      position: 'top' as const,
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

const RevenueByDays = () => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const chartRef = useRef(null)
  const data = (mocks as Data[]).filter(d => d.restaurant_id === 1005879)

  const renderChart = () => (
    <div
      ref={chartRef}
      className="h-full w-full flex items-center justify-center"
    >
      <Bar
        options={options}
        className="my-auto"
        data={{
          labels: Array(new Date().getDate())
            .fill(null)
            .map((_, day) => day + 1),
          datasets: [
            {
              type: 'bar',
              label: 'Revenue',
              data: data.map(d => d.pay_sum),
              backgroundColor: [
                `${theme`colors.blue.500`}`,
                `${theme`colors.red.400`}`,
                `${theme`colors.purple.500`}`,
                `${theme`colors.red.300`}`,
                `${theme`colors.yellow.400`}`,
                `${theme`colors.yellow.800`}`,
              ],
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
      documentTitle={t('dashboard.report.revenueByDays')}
    />
  )

  return (
    <ReportCard
      title={t('dashboard.report.revenueByDays')}
      onViewFull={() => setVisible(true)}
      print={print()}
    >
      {renderChart()}
      <FullScreenModal
        title={t('dashboard.report.revenueByDays')}
        visible={visible}
        onClose={() => setVisible(false)}
        print={print()}
      >
        <div className="w-4/5 flex-1 m-auto flex items-center">
          {renderChart()}
        </div>
      </FullScreenModal>
    </ReportCard>
  )
}

export default RevenueByDays
