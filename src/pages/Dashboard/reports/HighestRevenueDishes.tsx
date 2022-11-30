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
  indexAxis: 'y',
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
}

const HighestRevenueDishes = () => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const chartRef = useRef(null)

  const renderChart = () => (
    <div
      ref={chartRef}
      className="h-full w-full flex items-center justify-center"
    >
      <Bar
        className="my-auto"
        options={options}
        data={{
          labels: ['Beer', 'Meet', 'Snack', 'Coca', 'Milk tea', 'Rice'],
          datasets: [
            {
              indexAxis: 'y',
              data: [65, 59, 80, 23, 43, 53],
              label: 'Revenue',
              backgroundColor: [`${theme`colors.red.300`}`],
            },
            {
              indexAxis: 'y',
              data: [25, 19, 30, 3, 13, 23],
              label: 'Net income',
              backgroundColor: [`${theme`colors.red.100`}`],
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
      documentTitle={t('dashboard.report.highestRevenueDishes')}
    />
  )

  return (
    <ReportCard
      title={t('dashboard.report.highestRevenueDishes')}
      onViewFull={() => setVisible(true)}
      print={print()}
    >
      {renderChart()}
      <FullScreenModal
        title={t('dashboard.report.highestRevenueDishes')}
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

export default HighestRevenueDishes
