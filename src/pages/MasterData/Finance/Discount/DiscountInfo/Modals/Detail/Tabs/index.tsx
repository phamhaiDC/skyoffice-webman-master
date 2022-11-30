import { useTranslation } from 'react-i18next'
import { ModalTabs } from '@components/Tabs'
import { Discount } from '@models'
import DiscountDetails from './DiscountDetails'
import History from './History'

type Props = {
  discount: Discount
  isUpdatingParent: boolean
  handleSaveParent: () => void
}

const TabFields: React.FC<Props> = ({
  discount,
  isUpdatingParent,
  handleSaveParent,
}) => {
  const { t } = useTranslation()

  return (
    <ModalTabs
      defaultActiveKey="discountDetails"
      className="pt-1"
      destroyInactiveTabPane
    >
      <ModalTabs.TabPane tab={t('common.tab.details')} key="discountDetails">
        <DiscountDetails
          discount={discount}
          isUpdatingParent={isUpdatingParent}
          handleSaveParent={handleSaveParent}
        />
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
