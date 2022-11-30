import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalTabs } from '@components/Tabs'
import { Classification, ImageObject, Price } from '@models'
import Scrollable from '../../../../../../../../layout/Scrollable'
import Basic from './Basic'
import Classifications from './Classifications'
import History from './History'
import HtmlPreview from './HtmlPreview'
import Pictures from './Pictures'
import Prices from './Prices'
import Review from './Review'
import Statistics from './Statistics'

type Props = {
  prices?: Price[]
  classificatorGroups?: Classification[]
  pictures: ImageObject[]
}

const TabFields: React.FC<Props> = ({
  prices,
  classificatorGroups,
  pictures,
}) => {
  const { t } = useTranslation()
  const [visibleDropZone, setVisibleDropZone] = useState<boolean>(false)
  const handleDragOver = useCallback((e: any) => {
    e.preventDefault()
    setVisibleDropZone(true)
  }, [])
  const handleDragLeave = () => {
    setVisibleDropZone(false)
  }
  const handleDrop = () => {
    setTimeout(() => setVisibleDropZone(false), 2000)
  }
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
        tab={t('common.tab.classifications')}
        key="classifications"
        className="h-full"
      >
        <Scrollable
          className="!pl-0 !pr-8 !pt-5 !overflow-x-hidden"
          style={{
            height: 'calc(100vh - 12.125rem)',
          }}
        >
          <Classifications classifications={classificatorGroups} />
        </Scrollable>
      </ModalTabs.TabPane>
      <ModalTabs.TabPane
        tab={t('common.tab.pictures')}
        key="pictures"
        className="h-full"
      >
        <Scrollable
          className="!pl-0 !pr-8 !pt-5 !overflow-x-hidden"
          style={{
            height: 'calc(100vh - 12.125rem)',
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Pictures pictures={pictures} visibleDropZone={visibleDropZone} />
        </Scrollable>
      </ModalTabs.TabPane>
      <ModalTabs.TabPane
        tab={t('common.tab.statistics')}
        key="statistics"
        className="h-full"
      >
        <Statistics />
      </ModalTabs.TabPane>
      <ModalTabs.TabPane
        tab={t('common.tab.review')}
        key="review"
        className="h-full"
      >
        <Review />
      </ModalTabs.TabPane>
      <ModalTabs.TabPane
        tab={t('common.tab.htmlPreview')}
        key="htmlPreview"
        className="h-full"
      >
        <HtmlPreview />
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
