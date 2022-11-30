import { t } from 'i18next'

export const requiredRule = {
  required: t('common.rule.required'),
}

export const lengthOfNameRule = {
  maxLength: {
    value: 100,
    message: t('common.rule.maxLengthOfName'),
  },
}
