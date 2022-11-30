import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { ReactComponent as CancelIcon } from '@assets/icons/Cancel.svg'
import { confirm } from '../../utils/modal'
import AnimateIcon from '../elements/AnimateIcon'

type Props = PropsWithChildren<{
  title: string
  visible: boolean
  isCreating: boolean
  isDirty: boolean
  onSave: () => void
  onClose: () => void
}>

const AddModal: React.FC<Props> = ({
  title,
  visible,
  isCreating,
  isDirty,
  onSave,
  onClose,
  children,
}) => {
  const { t } = useTranslation()

  const close = () => {
    if (isDirty) {
      return confirm(t('common.confirm.unsave'), 'primary', () => onClose())()
    }
    return onClose()
  }

  return (
    <StyledModal
      visible={visible}
      destroyOnClose
      closeIcon={
        <AnimateIcon
          activeColor={theme`colors.white`}
          bgColor={theme`colors.red.500`}
          onClick={close}
        >
          <CancelIcon />
        </AnimateIcon>
      }
      maskClosable={false}
      title={title}
      footer={[
        <Button onClick={close}>{t('common.cancel')}</Button>,
        <Button
          onClick={onSave}
          loading={isCreating}
          disabled={!isDirty}
          type="primary"
        >
          {t('common.save')}
        </Button>,
      ]}
    >
      {children}
    </StyledModal>
  )
}

export default AddModal

const StyledModal = styled(Modal)`
  min-width: 500px;

  .ant-modal-header {
    ${tw`border-b-0 h-12 px-4 py-3 flex items-center font-medium text-base`}
  }

  .ant-modal-close-x {
    ${tw`h-full flex items-center justify-end pr-4`}
  }

  .ant-modal-close {
    ${tw`h-[38px]`}
  }

  .ant-modal-body {
    ${tw`p-0`}
  }

  .ant-modal-footer {
    ${tw`h-14 flex items-center justify-end px-4 py-3`}
  }
`
