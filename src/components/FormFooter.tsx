import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import styled from 'styled-components'
import { theme } from 'twin.macro'
import { useFormStateStore } from '../store'
import { confirm } from '../utils/modal'

type FormFooterProps = {
  isLoading: boolean
  disabled: boolean
  onSave: () => void
  onCancel: () => void
}

const FormFooter: React.FC<FormFooterProps> = ({
  isLoading,
  disabled,
  onSave,
  onCancel,
}) => {
  const setIsDirty = useFormStateStore(state => state.setIsDirty)
  const { t } = useTranslation()
  const {
    formState: { isDirty, dirtyFields },
  } = useFormContext()

  useEffect(() => {
    setIsDirty(isDirty)
  }, [isDirty])

  return (
    <FooterContainer>
      <Button
        type="primary"
        onClick={onSave}
        loading={isLoading}
        disabled={disabled || !(Object.keys(dirtyFields).length !== 0)}
      >
        {t('common.save')}
      </Button>
      <Button
        onClick={
          isDirty
            ? confirm(t('common.confirm.unsave'), 'primary', onCancel)
            : onCancel
        }
      >
        {t('common.cancel')}
      </Button>
    </FooterContainer>
  )
}

export default FormFooter

const FooterContainer = styled.div.attrs({
  className: 'flex justify-start items-center gap-2 pl-4 h-14',
})`
  border-top: 1px solid ${theme`colors.table.line`};
`
