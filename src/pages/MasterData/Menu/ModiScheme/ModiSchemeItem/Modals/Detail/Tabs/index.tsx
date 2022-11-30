import { useTranslation } from 'react-i18next'
import { ModalTabs } from '@components/Tabs'
import { ModiScheme } from '@models'
import History from './History'
import ModiSchemeDetails from './ModiSchemeDetails'

type Props = {
  modiScheme: Pick<ModiScheme, 'id' | 'name' | 'useUpperLimit' | 'priceTypes'>
  isUpdatingParent: boolean
  onSaveParent: () => void
}

export const TabFields: React.FC<Props> = ({
  modiScheme,
  isUpdatingParent,
  onSaveParent,
}) => {
  const { t } = useTranslation()

  return (
    <ModalTabs
      defaultActiveKey="modiSchemeDetails"
      className="pt-1"
      destroyInactiveTabPane
    >
      <ModalTabs.TabPane
        tab={t('modiScheme.detail.modiSchemeDetails')}
        key="modiSchemeDetails"
        className="h-full"
      >
        <ModiSchemeDetails
          modiScheme={modiScheme}
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
