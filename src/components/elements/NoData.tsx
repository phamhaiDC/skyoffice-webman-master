import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type Props = { loading?: boolean; icon?: ReactNode; className?: string }
const NoData: React.FC<Props> = ({ loading = false, icon, className }) => {
  const { t } = useTranslation()

  if (!loading) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        {icon}
        <span className="font-normal text-black">{t('common.noData')}</span>
      </div>
    )
  }
  return <div className="h-6" />
}

export default NoData
