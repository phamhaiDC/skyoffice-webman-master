import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Select } from 'antd'
import styled from 'styled-components'
import logo from '@assets/logo.png'
import LanguagePicker from '@components/LanguagePicker'
import { useAuthStore } from '@store'
import versionData from '../../version.json'

const SelectOrg = () => {
  const { t } = useTranslation()
  const { orgId, setOrg, loginResponse } = useAuthStore()
  const navigate = useNavigate()

  const handleSelect = () => {
    navigate('/')
  }

  return (
    <Container>
      <div className="basis-1/5" />
      <Center>
        <div className="flex justify-between mb-4">
          <Logo src={logo} alt="logo" />
          <LanguagePicker />
        </div>
        <span className="font-semibold text-2xl text-gray-700">
          {t('selectOrg.selectAnOrg')}
        </span>
        <Select
          value={orgId}
          onChange={setOrg}
          placeholder={t('common.selectOrg')}
        >
          {loginResponse?.organizations.map(_org => (
            <Select.Option key={_org.id} value={_org.id}>
              {_org.name}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          className="w-full"
          onClick={handleSelect}
          disabled={!orgId}
        >
          {t('common.next')}
        </Button>
      </Center>
      <span className="font-normal text-sm text-gray-400 mt-6">
        {t('common.version')}{' '}
        {`${versionData.buildMajor}.${versionData.buildMinor}.${versionData.buildRevision}`}
      </span>
    </Container>
  )
}

export default SelectOrg

const Container = styled.div.attrs({
  className: 'h-screen w-screen flex flex-col items-center bg-menu-bg',
})``

const Center = styled.div.attrs({
  className: 'bg-white p-6 rounded flex flex-col gap-4',
})`
  width: 428px;
  min-width: 428px;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.08);
`

const Logo = styled.img`
  height: 40px;
  width: 123.2px;
`
