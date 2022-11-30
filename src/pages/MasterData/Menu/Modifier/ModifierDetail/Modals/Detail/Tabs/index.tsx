import { useTranslation } from 'react-i18next'
import { ModalTabs } from '@components/Tabs'
import { Price } from '@models'
import Basic from './Basic'
import History from './History'
import Prices from './Prices'

type Props = {
  prices?: Price[]
}

const TabFields: React.FC<Props> = ({ prices }) => {
  const { t } = useTranslation()

  return (
    <ModalTabs defaultActiveKey="basic" className="pt-1" destroyInactiveTabPane>
      <ModalTabs.TabPane
        tab={t('common.tab.basic')}
        key="basic"
        className="h-full"
      >
        <Basic />
      </ModalTabs.TabPane>
      <ModalTabs.TabPane
        tab={t('common.tab.prices')}
        key="prices"
        className="h-full"
      >
        <Prices prices={prices} />
      </ModalTabs.TabPane>
      <ModalTabs.TabPane
        tab={t('common.tab.history')}
        key="history"
        className="h-full"
      >
        <History />
      </ModalTabs.TabPane>
    </ModalTabs>
  )
}

export default TabFields
