import { useTranslation } from 'react-i18next'
import { Select } from 'antd'
import styled from 'styled-components'
import { ReactComponent as ArrowDown } from '@assets/icons/ArrowDown.svg'
import { ReactComponent as En } from '@assets/icons/flags/en.svg'
import { ReactComponent as Vi } from '@assets/icons/flags/vi.svg'

const LANGUAGES = {
  en: { label: 'English', icon: <En /> },
  vi: { label: 'Tiếng Việt', icon: <Vi /> },
}

const LanguagePicker = () => {
  const { i18n } = useTranslation()

  return (
    <BorderlessSelect<string>
      value={i18n.language.split('-')[0]}
      onChange={lang => i18n.changeLanguage(lang)}
      suffixIcon={<ArrowDown />}
    >
      {Object.entries(LANGUAGES).map(([lang, { label, icon }]) => (
        <Select.Option value={lang} key={lang}>
          <OptionContent>
            {icon}
            {label}
          </OptionContent>
        </Select.Option>
      ))}
    </BorderlessSelect>
  )
}

export default LanguagePicker

const BorderlessSelect = styled(Select)<any>`
  .ant-select-selector {
    border: none !important;
  }

  .ant-select-arrow {
    top: 0;
    height: 32px;
    margin-top: -2px;
  }

  .ant-select-selection-item {
    padding-right: 30px !important;
  }
` as typeof Select

const OptionContent = styled.span.attrs({
  className: 'flex items-center gap-3',
})`
  line-height: 2rem;
`
