import { useRef, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import ReactToPrint from 'react-to-print'
import { Tooltip } from 'antd'
import {
  ArcElement,
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

ChartJS.register(
  ArcElement,
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement,
  Title,
  Legend
)

const options: React.ComponentProps<typeof Pie>['options'] = {
  responsive: true,
  layout: {
    padding: 50,
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 32,
      },
    },
  },
}

const OrderStatus = () => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const chartRef = useRef(null)

  const renderChart = () => (
    <div
      ref={chartRef}
      className="h-full w-full flex items-center justify-center"
    >
      <Pie
        className="w-[500px] h-[500px] m-auto"
        options={options}
        data={{
          labels: ['Food', 'Drink'],
          datasets: [
            {
              data: [60, 40],
              backgroundColor: [
                `${theme`colors.yellow.500`}`,
                `${theme`colors.blue.500`}`,
              ],
              borderWidth: 0,
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
      documentTitle={t('dashboard.report.orderStatus')}
    />
  )

  return (
    <ReportCard
      title={t('dashboard.report.orderStatus')}
      onViewFull={() => setVisible(true)}
      print={print()}
    >
      {renderChart()}
      <FullScreenModal
        title={t('dashboard.report.orderStatus')}
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

export default OrderStatus
