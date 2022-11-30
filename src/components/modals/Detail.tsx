import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { confirm } from '@utils/modal'
import { CancelIcon } from '../../assets/icons/Cancel'
import animateSvgCss from '../../styles/AnimatedSvg'
import Spin from '../elements/Spin'

type Props = PropsWithChildren<{
  visible: boolean
  isLoading: boolean
  isUpdating: boolean
  isDirty: boolean
  onClose: () => void
  onSave: () => void
}>

const DetailModal: React.FC<Props> = ({
  visible,
  isLoading,
  isUpdating,
  isDirty,
  onClose,
  onSave,
  children,
}) => {
  const { t } = useTranslation()

  const close = () => {
    if (isDirty) {
      return confirm(t('common.confirm.unsave'), 'primary', () => {
        return onClose()
      })()
    }
    return onClose()
  }

  return (
    <StyledModal
      visible={visible}
      onCancel={close}
      closeIcon={
        <StyledAnimateIcon
          activeColor={theme`colors.white`}
          bgColor={theme`colors.red.500`}
        >
          <CancelIcon />
        </StyledAnimateIcon>
      }
      closable
      maskClosable={false}
      destroyOnClose
      width="80vw"
      footer={[
        <Button onClick={close}>{t('common.cancel')}</Button>,
        <Button
          onClick={onSave}
          loading={isUpdating}
          disabled={!isDirty || isLoading}
          type="primary"
        >
          {t('common.save')}
        </Button>,
      ]}
    >
      {isLoading ? <Spin /> : <Container>{children}</Container>}
    </StyledModal>
  )
}

export default DetailModal

const StyledModal = styled(Modal)`
  max-width: 1250px;
  top: 48px;
  height: calc(100vh - 96px);
  padding-bottom: 0;

  .ant-modal-content {
    ${tw`h-full`}
  }

  .ant-modal-body {
    ${tw`pl-4 pr-0 py-0`};
    height: calc(100% - 3.5rem);
  }

  .ant-modal-footer {
    height: 3.5rem;
  }
`

const Container = styled.div`
  ${tw`h-full w-full`}
`
type CloseProps = PropsWithChildren<{
  onClick?: () => void
  color?: string
  activeColor?: string
  bgColor?: string
}>
const StyledAnimateIcon = styled.span<CloseProps>`
  width: min-content;
  svg {
    margin-bottom: 2px;
  }
  ${tw`cursor-pointer`}
  ${props => animateSvgCss(props.color, props.activeColor, props.bgColor)}
`
