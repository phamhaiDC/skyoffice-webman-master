import React, { PropsWithChildren } from 'react'
import { Modal } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { ReactComponent as CancelIcon } from '@assets/icons/Cancel.svg'
import AnimateIcon from '@components/elements/AnimateIcon'

type Props = PropsWithChildren<{
  title: string
  visible: boolean
  onClose: () => void
  print?: React.ReactNode
}>

export const FullScreenModal: React.FC<Props> = ({
  title,
  visible,
  onClose,
  print,
  children,
}) => {
  return (
    <StyledModal
      visible={visible}
      maskClosable={false}
      closable={false}
      footer={null}
      className="flex flex-col"
      destroyOnClose
    >
      <Header>
        <Title>{title}</Title>
        <Action>
          {/* {print} */}
          <AnimateIcon
            activeColor={theme`colors.white`}
            bgColor={theme`colors.red.500`}
            onClick={onClose}
          >
            <CancelIcon />
          </AnimateIcon>
        </Action>
      </Header>
      {children}
    </StyledModal>
  )
}

const Header = styled.div`
  ${tw`flex justify-between items-center`}
`

const Title = styled.span`
  ${tw`font-semibold text-base capitalize`}
`

const Action = styled.div`
  ${tw`flex items-center justify-end gap-2`}
`

const StyledModal = styled(Modal)`
  margin: unset;
  ${tw`!w-[100vw] !h-[100vh] top-0`}

  .ant-modal-content {
    ${tw`w-[100vw] rounded-none`}
  }

  .ant-modal-body {
    height: calc(100vh);
    ${tw`px-4 py-3 flex flex-col`}
  }
`
