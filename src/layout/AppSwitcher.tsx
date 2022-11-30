import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Drawer } from 'antd'
import { theme } from 'twin.macro'
import { ReactComponent as CancelIcon } from '@assets/icons/Cancel.svg'
import { ReactComponent as DashboardIcon } from '@assets/icons/Dashboard.svg'
import { ReactComponent as MasterDataIcon } from '@assets/icons/MasterData.svg'
import { MenuIcon } from '@assets/icons/Menu'
import { ReactComponent as ReportIcon } from '@assets/icons/Report.svg'
import AnimateIcon from '@components/elements/AnimateIcon'

const AppSwitcher: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const show = () => setVisible(true)
  const hide = () => setVisible(false)
  const goTo = (to: string) => {
    navigate(to)
    hide()
  }

  return (
    <>
      <MenuIcon onClick={show} />
      <Drawer
        title={
          <div className="flex justify-between items-center">
            <MenuIcon color="black" onClick={hide} />
            <AnimateIcon
              activeColor={theme`colors.white`}
              bgColor={theme`colors.red.500`}
              onClick={hide}
            >
              <CancelIcon />
            </AnimateIcon>
          </div>
        }
        closable={false}
        placement="left"
        visible={visible}
        bodyStyle={{ padding: '1rem' }}
        headerStyle={{ border: 'none', padding: '1rem', height: '3rem' }}
      >
        <span className="text-2xl font-bold">{t('common.applications')}</span>
        <div className="mt-8 flex flex-wrap">
          <AppMenuItem
            name="Dashboard"
            icon={<DashboardIcon />}
            onClick={() => goTo('/')}
          />
          <AppMenuItem
            name="Master Data"
            icon={<MasterDataIcon />}
            onClick={() => goTo('/menu')}
          />
          <AppMenuItem
            name="Reports"
            icon={<ReportIcon />}
            onClick={() => goTo('/reports')}
          />
        </div>
      </Drawer>
    </>
  )
}

export default AppSwitcher

type AppMenuItemProps = {
  name: string
  icon: React.ReactElement
  onClick: () => void
}

const AppMenuItem: React.FC<AppMenuItemProps> = ({ name, icon, onClick }) => {
  return (
    <div
      className="flex items-center w-1/2 mb-8 cursor-pointer hover:text-blue-500"
      onClick={onClick}
    >
      {icon}
      <span className="ml-2 text-base font-medium">{name}</span>
    </div>
  )
}
