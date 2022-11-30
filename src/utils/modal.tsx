import { Modal } from 'antd'
import { LegacyButtonType } from 'antd/lib/button/button'
import { t } from 'i18next'

export const confirm =
  (title: string, okType: LegacyButtonType, onOk: () => void) => () => {
    Modal.confirm({
      title,
      onOk,
      okText: `${t('common.yes')}`,
      cancelText: `${t('common.cancel')}`,
      okType,
      // centered: true,
    })
  }

export const confirmAsync =
  (title: string, okType: LegacyButtonType, onOk: () => Promise<any>) => () => {
    Modal.confirm({
      title,
      onOk: () => onOk().catch(),
      okText: `${t('common.yes')}`,
      cancelText: `${t('common.cancel')}`,
      okType,
    })
  }
