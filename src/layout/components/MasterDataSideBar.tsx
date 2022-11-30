import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useMatch, useNavigate } from 'react-router-dom'
import { MenuItem, MenuItemGroup } from '../../components/Menu'
import { MASTER_DATA_PAGES } from '../pages'
import SideBar, { ItemProps, SideBarRef } from './SideBar'

const MasterDataSideBar: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const match = useMatch({ path: '*' })
  const selectedKey = match?.pathname.split('/')[2]
  const items: ItemProps[] = useMemo(
    () => [
      {
        key: 'menu',
        group: true,
        label: t('sideBar.menu.menu'),
        items: Object.values(MASTER_DATA_PAGES(t).menu),
      },
      {
        key: 'finance',
        group: true,
        label: t('sideBar.finance.finance'),
        items: Object.values(MASTER_DATA_PAGES(t).finance),
      },
      {
        key: 'administration',
        group: true,
        label: t('sideBar.administration.administration'),
        items: Object.values(MASTER_DATA_PAGES(t).administration),
      },
    ],
    [t]
  )

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

export default MasterDataSideBar
