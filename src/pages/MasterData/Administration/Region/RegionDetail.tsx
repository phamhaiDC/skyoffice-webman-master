import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { message } from 'antd'
import { RegionCreateInputs } from 'models'
import {
  useCreateRegionMutation,
  useGetRegionDetailQuery,
  useUpdateRegionMutation,
} from '@apis'
import DrawerDetail from '@components/DrawerDetail'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

type RegionDetailProps = {
  visible: boolean
  onClose: () => void
  onCreateSuccess: () => void
  regionId?: number
}

const RegionDetail: React.FC<RegionDetailProps> = ({
  visible,
  onClose,
  onCreateSuccess,
  regionId,
}) => {
  const { t } = useTranslation()

  return (
    <DrawerDetail
      visible={visible}
      onClose={onClose}
      title={t('region.detail')}
    >
      <RegionForm
        onClose={onClose}
        onCreateSuccess={onCreateSuccess}
        regionId={regionId}
      />
    </DrawerDetail>
  )
}

type RegionFormProps = {
  onClose: () => void
  onCreateSuccess: () => void
  regionId?: number
}

const RegionForm: React.FC<RegionFormProps> = ({
  onClose,
  onCreateSuccess,
  regionId,
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<RegionCreateInputs>({
    defaultValues: { status: 1 },
  })
  const { handleSubmit } = formMethods

  const {
    data: region,
    isLoading,
    remove,
  } = useGetRegionDetailQuery(regionId, {
    enabled: !!regionId,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      onClose()
      message.error({ content: e.message })
    },
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  const { mutate: createRegion, isLoading: isCreating } =
    useCreateRegionMutation({
      onSuccess: () => {
        onClose()
        message.success({ content: t('region.create.success') })
        queryClient.invalidateQueries('getRegions')
        onCreateSuccess()
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })
  const { mutate: updateRegion, isLoading: isUpdating } =
    useUpdateRegionMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getRegions')
        onClose()
        message.success({ content: t('region.update.success') })
      },
      onError: (e: any) => {
        onClose()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (!regionId) {
      createRegion(data)
    } else {
      updateRegion([{ ...data, id: regionId }])
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
          formItemProps={{ required: true, tooltip: t('region.tooltip.name') }}
        />
        <NumberInput
          name="code"
          label={t('common.field.code')}
          formItemProps={{ tooltip: t('region.tooltip.code') }}
        />
        <FormInput
          name="altName"
          label={t('common.field.altName')}
          formItemProps={{ tooltip: t('region.tooltip.altName') }}
        />
        <FormStatusSwitch name="status" originalStatus={region?.status} />
      </FormDetail>
    </FormProvider>
  )
}

export default RegionDetail
