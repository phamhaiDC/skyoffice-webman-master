import { useTranslation } from 'react-i18next'
import { PricesTab } from '@components/PriceTab'
import Tabs from '@components/Tabs'
import { Price } from '@models'
import { BasicTab } from './BasicTab'
import { PortionTab } from './PortionTab'
import { RestrictionTab } from './RestrictionTab'

type Props = {
  prices: Price[]
}

export const TabFields: React.FC<Props> = ({ prices }) => {
  const { t } = useTranslation()

  return (
    <Tabs defaultActiveKey="basic" className="h-fit" destroyInactiveTabPane>
      <Tabs.TabPane tab={t('common.tab.basic')} key="basic">
        <BasicTab />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t('common.tab.restriction')} key="restriction">
        <RestrictionTab />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t('common.tab.prices')} key="prices">
        <PricesTab prices={prices} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t('common.tab.portion')} key="portion">
        <PortionTab />
      </Tabs.TabPane>
    </Tabs>
  )
}
