import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Drawer, DrawerProps } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { useFormStateStore } from '../store'
import { confirm } from '../utils/modal'
import DrawerTitle from './elements/DrawerTitle'

export type DrawerDetailProps = PropsWithChildren<{
  title: string
  visible: boolean
  onClose: () => void
  drawerProps?: DrawerProps
}>

const DrawerDetail: React.FC<DrawerDetailProps> = ({
  title,
  visible,
  onClose,
  drawerProps,
  children,
}) => {
  const { t } = useTranslation()
  const isDirty = useFormStateStore(state => state.isDirty)

  const close = () => {
    if (isDirty) {
      return confirm(t('common.confirm.unsave'), 'primary', onClose)()
    }
    return onClose()
  }

  return (
    <StyledDrawer
      title={<DrawerTitle title={title} onClose={close} />}
      width="35vw"
      headerStyle={tw`p-4`}
      contentWrapperStyle={{ minWidth: '500px' }}
      bodyStyle={tw`p-0`}
      visible={visible}
      onClose={close}
      closable={false}
      destroyOnClose
      keyboard
      {...drawerProps}
    >
      {children}
    </StyledDrawer>
  )
}

export default DrawerDetail

const StyledDrawer = styled(Drawer)`
  height: 100vh;
  .ant-drawer-header {
    ${tw`h-12`}
    border-bottom: 1px solid ${theme`colors.table.line` as string};
  }
`
