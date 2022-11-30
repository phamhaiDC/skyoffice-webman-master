import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { message } from 'antd'
import { PriceTypeCreateInputs } from 'models'
import {
  useCreatePriceTypeMutation,
  useGetPriceTypeDetailQuery,
  useUpdatePriceTypesMutation,
} from '@apis'
import DrawerDetail from '@components/DrawerDetail'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { lengthOfNameRule, requiredRule } from '@utils/rules'
import FormTextArea from '../../../../components/form/FormTextArea'

type PriceTypeDetailProps = {
  visible: boolean
  onClose: () => void
  onCreateSuccess: () => void
  priceTypeId?: number
}

const PriceTypeDetail: React.FC<PriceTypeDetailProps> = ({
  visible,
  onClose,
  onCreateSuccess,
  priceTypeId,
}) => {
  const { t } = useTranslation()

  return (
    <DrawerDetail
      visible={visible}
      onClose={onClose}
      title={t('priceType.detail')}
    >
      <PriceTypeForm
        onClose={onClose}
        onCreateSuccess={onCreateSuccess}
        priceTypeId={priceTypeId}
      />
    </DrawerDetail>
  )
}

type PriceTypeFormProps = {
  onClose: () => void
  onCreateSuccess: () => void
  priceTypeId?: number
}

const PriceTypeForm: React.FC<PriceTypeFormProps> = ({
  onClose,
  onCreateSuccess,
  priceTypeId,
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<PriceTypeCreateInputs>({
    defaultValues: { status: 1 },
  })
  const { handleSubmit } = formMethods

  const {
    data: priceType,
    isLoading,
    remove,
  } = useGetPriceTypeDetailQuery(priceTypeId, {
    enabled: !!priceTypeId,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      onClose()
      message.error({ content: e.message })
    },
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  const { mutate: createPriceType, isLoading: isCreating } =
    useCreatePriceTypeMutation({
      onSuccess: () => {
        onClose()
        message.success({ content: t('priceType.create.success') })
        queryClient.invalidateQueries('getPriceTypes')
        onCreateSuccess()
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })
  const { mutate: updatePriceType, isLoading: isUpdating } =
    useUpdatePriceTypesMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getPriceTypes')
        onClose()
        message.success({ content: t('priceType.update.success') })
      },
      onError: (e: any) => {
        onClose()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (!priceTypeId) {
      createPriceType(data)
    } else {
      updatePriceType([{ ...data, id: priceTypeId }])
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
            tooltip: t('priceType.tooltip.name'),
          }}
        />
        <NumberInput
          name="code"
          label={t('common.field.code')}
          formItemProps={{ tooltip: t('priceType.tooltip.code') }}
        />
        <FormInput
          name="altName"
          label={t('common.field.altName')}
          formItemProps={{ tooltip: t('priceType.tooltip.altName') }}
        />
        <FormTextArea
          name="description"
          label={t('common.field.description')}
          formItemProps={{ tooltip: t('priceType.tooltip.description') }}
        />
        <FormStatusSwitch name="status" originalStatus={priceType?.status} />
      </FormDetail>
    </FormProvider>
  )
}

export default PriceTypeDetail
