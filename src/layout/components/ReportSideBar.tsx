import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useMatch } from 'react-router-dom'
import { MenuItem, MenuItemGroup } from '../../components/Menu'
import { REPORT_PAGES } from '../pages'
import SideBar, { ItemProps, SideBarRef } from './SideBar'

const ReportSideBar: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const items: ItemProps[] = useMemo(
    () => [
      {
        key: 'revenue',
        group: true,
        label: t('sideBar.revenue.revenue'),
        items: Object.values(REPORT_PAGES(t).revenue),
      },
      {
        key: 'finance',
        group: true,
        label: t('sideBar.finance.finance'),
        items: Object.values(REPORT_PAGES(t).finance),
      },
      {
        key: 'customer',
        group: true,
        label: t('sideBar.customer.customer'),
        items: Object.values(REPORT_PAGES(t).customer),
      },
    ],
    [t]
  )
  const match = useMatch({ path: '*' })
  const selectedKey = match?.pathname.split('/')[3]
  const ref = useRef<SideBarRef>(null)
  const handleClickItem = (key: string) => {
    navigate(key)
    ref.current?.setHovering(false)
  }

  return (
    <SideBar ref={ref} selectedKey={selectedKey}>
      {items.map(g => (
        <MenuItemGroup
          title={
            <>
              <span className="m-auto">{g.label[0]}</span>
              <span className="flex-1">{g.label.slice(1)}</span>
            </>
          }
          key={g.key}
        >
          {g.items?.map(i => (
            <MenuItem
              key={i.key}
              onClick={() => handleClickItem(`${g.key}/${i.key!}`)}
              id={i.key}
            >
              {i.icon}
              <span>{i.label}</span>
            </MenuItem>
          ))}
        </MenuItemGroup>
      ))}
    </SideBar>
  )
}

export default ReportSideBar
