import { useTranslation } from 'react-i18next'
import { ModalTabs } from '@components/Tabs'
import { ComboScheme } from '@models'
import ComboSchemeDetails from './ComboSchemeDetails'
import History from './History'

type Props = {
  comboScheme: Pick<ComboScheme, 'id' | 'name' | 'useUpperLimit' | 'priceTypes'>
  isUpdatingParent: boolean
  onSaveParent: () => void
}

export const TabFields: React.FC<Props> = ({
  comboScheme,
  isUpdatingParent,
  onSaveParent,
}) => {
  const { t } = useTranslation()

  return (
    <ModalTabs
      defaultActiveKey="comboSchemeDetails"
      className="pt-1"
      destroyInactiveTabPane
    >
      <ModalTabs.TabPane
        tab={t('comboScheme.detail.comboSchemeDetails')}
        key="comboSchemeDetails"
        className="h-full"
      >
        <ComboSchemeDetails
          comboScheme={comboScheme}
          isUpdatingParent={isUpdatingParent}
          onSaveParent={onSaveParent}
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
