import { useTranslation } from 'react-i18next'
import FormInput from '@components/form/FormInput'

export const BasicTab: React.FC = () => {
  const { t } = useTranslation()

  return <FormInput name="barCodes" label={t('classification.item.barCodes')} />
}
