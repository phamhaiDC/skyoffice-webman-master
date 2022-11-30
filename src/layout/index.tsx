import { PropsWithChildren, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsFetching } from 'react-query'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Avatar, Dropdown, Menu, Progress } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { UserOutlined } from '@ant-design/icons'
import { ReactComponent as ArrowDropdown } from '@assets/icons/ArrowDropdown.svg'
import { ReactComponent as NotificationIcon } from '@assets/icons/Notification.svg'
import { ReactComponent as SelectOrgIcon } from '@assets/icons/SelectOrgIcon.svg'
import { ReactComponent as SettingIcon } from '@assets/icons/Setting.svg'
import LogoutOverlay from '@components/LogoutOverlay'
import { useAuthStore } from '@store'
import useDebounce from '../hooks/useDebounce'
import MasterDataSideBar from './components/MasterDataSideBar'
import ReportSideBar from './components/ReportSideBar'
import AppSwitcher from './AppSwitcher'
import Scrollable from './Scrollable'
import 'rc-menu/assets/index.css'

type Props = PropsWithChildren<{}>

const AppLayout: React.FC<Props> = ({ children }) => {
  const fetching = useIsFetching()
  const debouncedFetching = useDebounce(fetching, 100)
  const [percent, setPercent] = useState(0)
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    let timeout: any
    if (fetching) {
      setPercent(0)
      timeout = setTimeout(() => setPercent(30), 10)
    } else {
      setPercent(100)
    }
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [fetching])

  const [visibleDropdown, setVisibleDropdown] = useState(false)
  const { loginResponse, setOrg, orgId } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const orgMenu = (
    <Menu
      items={loginResponse?.organizations?.map(org => ({
        label: org.name,
        key: org.id,
        onClick: () => {
          setOrg(org.id)
          navigate(0)
        },
      }))}
    />
  )

  return (
    <Container>
      {debouncedFetching ? (
        <ProgressBar
          trailColor={theme`colors.red.400`}
          percent={percent}
          showInfo={false}
          size="small"
          status="active"
        />
      ) : null}
      <Header>
        <div className="flex items-center gap-3">
          <AppSwitcher />
          <span className="text-base font-bold text-white cursor-pointer flex gap-3 items-center">
            <span onClick={() => navigate('/')}>SkyOffice</span> <LineDivide />
            <span className="font-medium">
              <Routes>
                <Route
                  path="dashboard/*"
                  element={
                    <AppRouteText>{t('application.dashboard')}</AppRouteText>
                  }
                />
                <Route
                  path="reports/*"
                  element={
                    <AppRouteText>{t('application.reports')}</AppRouteText>
                  }
                />
                <Route
                  path="*"
                  element={
                    <AppRouteText>{t('application.masterData')}</AppRouteText>
                  }
                />
              </Routes>
            </span>
            <SelectOrgIcon className="ml-4" />
            <Dropdown overlay={orgMenu}>
              <span className="font-medium flex items-center">
                {
                  loginResponse?.organizations?.find(org => org.id === orgId)
                    ?.name
                }
                <ArrowDropdown className="ml-1 mt-1" />
              </span>
            </Dropdown>
          </span>
        </div>
        <div className="flex items-center justify-around gap-8">
          <NotificationIcon className="cursor-pointer" />
          <SettingIcon className="cursor-pointer" />
          <Dropdown
            overlay={
              <LogoutOverlay
                onCloseDropdown={() => setVisibleDropdown(false)}
              />
            }
            trigger={['click']}
            visible={visibleDropdown}
            onVisibleChange={setVisibleDropdown}
          >
            <Avatar
              icon={<UserOutlined />}
              className="cursor-pointer "
              size={32}
              alt="avatar"
            />
          </Dropdown>
        </div>
      </Header>
      <Body>
        <Routes>
          <Route path="dashboard/*" />
          <Route path="reports/*" element={<ReportSideBar />} />
          <Route path="*" element={<MasterDataSideBar />} />
        </Routes>
        {children}
      </Body>
    </Container>
  )
}

export default AppLayout

const Container = styled.section.attrs({
  className: 'h-screen w-screen flex flex-col relative',
})``

const Header = styled.header.attrs({
  className: 'h-12 flex justify-between items-center px-4 bg-primary-500',
})`
  flex: 0 0 auto;
`

const Body = styled.main.attrs({
  className: 'flex flex-auto flex-row overflow-hidden',
})`
  height: calc(100vh - 48px);
`

export const PageContent = styled(Scrollable)`
  ${tw`h-full w-full p-0`}
  .simplebar-content {
    ${tw`w-full`}
  }
`

const LineDivide = styled.div.attrs({
  className: 'h-3 w-px bg-gray-200',
})``

const AppRouteText = styled.span`
  ${tw`text-gray-200`}
`

const ProgressBar = styled(Progress)`
  position: absolute;
  top: 0;
  left: 0;
  line-height: 0;
  .ant-progress-inner,
  .ant-progress-bg {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    height: 4px;
  }
`
