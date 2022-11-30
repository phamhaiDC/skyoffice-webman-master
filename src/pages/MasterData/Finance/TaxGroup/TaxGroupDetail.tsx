import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { message } from 'antd'
import { TaxGroupCreateInputs } from 'models'
import {
  useCreateTaxGroupMutation,
  useGetTaxGroupDetailQuery,
  useUpdateTaxGroupsMutation,
} from '@apis'
import DrawerDetail from '@components/DrawerDetail'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { lengthOfNameRule, requiredRule } from '@utils/rules'
import FormCheckbox from '../../../../components/form/FormCheckbox'
import FormTextArea from '../../../../components/form/FormTextArea'

type TaxGroupDetailProps = {
  visible: boolean
  onClose: () => void
  onCreateSuccess: () => void
  taxGroupId?: number
}

const TaxGroupDetail: React.FC<TaxGroupDetailProps> = ({
  visible,
  onClose,
  onCreateSuccess,
  taxGroupId,
}) => {
  const { t } = useTranslation()

  return (
    <DrawerDetail
      visible={visible}
      onClose={onClose}
      title={t('taxGroup.detail')}
    >
      <TaxGroupForm
        onClose={onClose}
        onCreateSuccess={onCreateSuccess}
        taxGroupId={taxGroupId}
      />
    </DrawerDetail>
  )
}

type TaxGroupFormProps = {
  onClose: () => void
  onCreateSuccess: () => void
  taxGroupId?: number
}

const TaxGroupForm: React.FC<TaxGroupFormProps> = ({
  onClose,
  onCreateSuccess,
  taxGroupId,
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<TaxGroupCreateInputs>({
    defaultValues: { status: 1 },
  })
  const { handleSubmit } = formMethods

  const {
    data: taxGroup,
    isLoading,
    remove,
  } = useGetTaxGroupDetailQuery(taxGroupId, {
    enabled: !!taxGroupId,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      onClose()
      message.error({ content: e.message })
    },
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  const { mutate: createTaxGroup, isLoading: isCreating } =
    useCreateTaxGroupMutation({
      onSuccess: () => {
        onClose()
        message.success({ content: t('taxGroup.create.success') })
        queryClient.invalidateQueries('getTaxGroups')
        onCreateSuccess()
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })
  const { mutate: updateTaxGroup, isLoading: isUpdating } =
    useUpdateTaxGroupsMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getTaxGroups')
        onClose()
        message.success({ content: t('taxGroup.update.success') })
      },
      onError: (e: any) => {
        onClose()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (!taxGroupId) {
      createTaxGroup(data)
    } else {
      updateTaxGroup([{ ...data, id: taxGroupId }])
    }
  })

  return (
    <FormProvider {...formMethods}>
      <FormDetail
        isExecuting={isCreating || isUpdating}
        isFetching={isLoading}
        onCancel={onClose}
        onSave={handleSave}
      >
        <FormInput
          name="name"
          label={t('common.field.name')}
          rules={{
            ...requiredRule,
            ...lengthOfNameRule,
          }}
          formItemProps={{
            required: true,
            tooltip: t('taxGroup.tooltip.name'),
          }}
        />
        <NumberInput
          name="code"
          label={t('common.field.code')}
          formItemProps={{ tooltip: t('taxGroup.tooltip.code') }}
        />
        <FormInput
          name="altName"
          label={t('common.field.altName')}
          formItemProps={{ tooltip: t('taxGroup.tooltip.altName') }}
        />
        <FormTextArea
          name="description"
          label={t('common.field.description')}
          formItemProps={{ tooltip: t('taxGroup.tooltip.description') }}
        />
        <FormCheckbox
          name="isDefaultTaxDishType"
          label={t('common.field.default')}
          defaultValue={taxGroup?.isDefaultTaxDishType}
          labelStyle="font-semibold"
        />

        <FormStatusSwitch name="status" originalStatus={taxGroup?.status} />
      </FormDetail>
    </FormProvider>
  )
}

export default TaxGroupDetail
