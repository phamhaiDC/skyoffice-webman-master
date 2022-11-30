import { useTranslation } from 'react-i18next'
import { Avatar } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { UserOutlined } from '@ant-design/icons'
import logo from '@assets/logo.png'
import { useAuthStore } from '@store'
import { confirm } from '@utils/modal'
import { clearTokens } from '../utils/storage'

type Props = {
  onCloseDropdown?: () => void
}

const LogoutOverlay: React.FC<Props> = ({ onCloseDropdown }) => {
  const { logout, user } = useAuthStore()
  const { t } = useTranslation()

  const handleLogOut = (): void => {
    logout()
    clearTokens()
  }

  return (
    <Container>
      <Header>
        <Logo src={logo} alt="logo" />
        <span
          className="font-normal cursor-pointer hover:text-blue-500 hover:underline"
          onClick={() => {
            if (onCloseDropdown) {
              onCloseDropdown()
            }
            confirm(t('auth.signOut.confirm'), 'danger', handleLogOut)()
          }}
        >
          {t('auth.signOut.signOut')}
        </span>
      </Header>
      <Body>
        <Avatar size={56} icon={<UserOutlined />} />
        <AccountInfo>
          <span className="font-semibold">{user?.name}</span>
          <span>{user?.username}</span>
        </AccountInfo>
      </Body>
      <Footer>
        <span>{t('auth.accountManagement')}</span>
      </Footer>
    </Container>
  )
}

export default LogoutOverlay

const Container = styled.div`
  ${tw`flex flex-col gap-5 bg-white shadow-popover mt-1 -mr-4`}
  width: 300px;
`

const Header = styled.div`
  ${tw`px-4 pt-4 flex justify-between items-center`}
`

const Body = styled.div`
  ${tw`px-4 gap-3 flex items-center`}
`

const AccountInfo = styled.div`
  ${tw`flex flex-col`}
`

const Footer = styled.div`
  ${tw`bg-menu-bg flex items-center justify-center py-2`}
`

const Logo = styled.img`
  height: 24.32px;
  width: 72px;
`
