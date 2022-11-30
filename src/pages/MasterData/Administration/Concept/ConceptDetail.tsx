import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { message } from 'antd'
import { ConceptCreateInputs } from 'models'
import {
  useCreateConceptMutation,
  useGetConceptDetailQuery,
  useUpdateConceptsMutation,
} from '@apis'
import DrawerDetail from '@components/DrawerDetail'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

type ConceptDetailProps = {
  visible: boolean
  onClose: () => void
  onCreateSuccess: () => void
  conceptId?: number
}

const ConceptDetail: React.FC<ConceptDetailProps> = ({
  visible,
  onClose,
  onCreateSuccess,
  conceptId,
}) => {
  const { t } = useTranslation()

  return (
    <DrawerDetail
      visible={visible}
      onClose={onClose}
      title={t('concept.detail')}
    >
      <ConceptForm
        onClose={onClose}
        onCreateSuccess={onCreateSuccess}
        conceptId={conceptId}
      />
    </DrawerDetail>
  )
}

type ConceptFormProps = {
  onClose: () => void
  onCreateSuccess: () => void
  conceptId?: number
}

const ConceptForm: React.FC<ConceptFormProps> = ({
  onClose,
  onCreateSuccess,
  conceptId,
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<ConceptCreateInputs>({
    defaultValues: { status: 1 },
  })
  const { handleSubmit } = formMethods

  const {
    data: concept,
    isLoading,
    remove,
  } = useGetConceptDetailQuery(conceptId, {
    enabled: !!conceptId,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      onClose()
      message.error({ content: e.message })
    },
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  const { mutate: createConcept, isLoading: isCreating } =
    useCreateConceptMutation({
      onSuccess: () => {
        onClose()
        message.success({ content: t('concept.create.success') })
        queryClient.invalidateQueries('getConcepts')
        onCreateSuccess()
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })
  const { mutate: updateConcept, isLoading: isUpdating } =
    useUpdateConceptsMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getConcepts')
        onClose()
        message.success({ content: t('concept.update.success') })
      },
      onError: (e: any) => {
        onClose()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (!conceptId) {
      createConcept(data)
    } else {
      updateConcept([{ ...data, id: conceptId }])
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
          formItemProps={{ required: true, tooltip: t('concept.tooltip.name') }}
        />
        <NumberInput
          name="code"
          label={t('common.field.code')}
          formItemProps={{ tooltip: t('concept.tooltip.code') }}
        />
        <FormInput
          name="altName"
          label={t('common.field.altName')}
          formItemProps={{ tooltip: t('concept.tooltip.altName') }}
        />
        <FormStatusSwitch name="status" originalStatus={concept?.status} />
      </FormDetail>
    </FormProvider>
  )
}

export default ConceptDetail
