import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { ClassificationCreateInputs } from 'models'
import {
  useCreateClassificationMutation,
  useGetClassificationDetailQuery,
  useUpdateClassificationsMutation,
} from '@apis'
import Spin from '@components/elements/Spin'
import { TreeDetailTitle } from '@components/elements/Title'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { FormItems, PageFormBody } from '@components/PageFormBody'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

const ClassificationGroupDetail = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const classificationGroupId = parseInt(
    useParams().classificationGroupId || '0',
    10
  )
  const formMethods = useForm<ClassificationCreateInputs>()
  const isCreate = useMatch({
    path: `menu/classification-groups/${classificationGroupId}/classification-groups`,
  })
  const { handleSubmit } = formMethods

  const backToListView = () =>
    navigate(`/menu/classification-groups/${classificationGroupId}`)

  const {
    data: classification,
    isLoading: isFetching,
    remove,
  } = useGetClassificationDetailQuery(classificationGroupId, {
    enabled: !!classificationGroupId && !isCreate,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createClassification, isLoading: isCreating } =
    useCreateClassificationMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getClassificationGroups')
        backToListView()
        message.success({ content: t('classification.group.create.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateClassification, isLoading: isUpdating } =
    useUpdateClassificationsMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getClassificationGroups')
        backToListView()
        message.success({ content: t('classification.group.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (isCreate) {
      createClassification(data)
    } else {
      updateClassification([{ ...data, id: classificationGroupId }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={
          isCreate
            ? t('classification.group.addNew')
            : t('classification.group.detail')
        }
        onBack={backToListView}
      />
      <FormProvider {...formMethods}>
        {isFetching ? (
          <Spin />
        ) : (
          <PageFormBody>
            <FormDetail
              isExecuting={isCreating || isUpdating}
              isFetching={isFetching}
              onCancel={backToListView}
              onSave={handleSave}
            >
              <FormItems>
                <FormInput
                  name="name"
                  label={t('common.field.name')}
                  rules={{
                    ...requiredRule,
                    ...lengthOfNameRule,
                  }}
                  formItemProps={{
                    tooltip: t('classification.group.tooltip.name'),
                    required: true,
                  }}
                />
                <NumberInput
                  name="code"
                  label={t('common.field.code')}
                  formItemProps={{
                    tooltip: t('classification.group.tooltip.code'),
                  }}
                />
                <FormInput
                  name="altName"
                  label={t('common.field.altName')}
                  formItemProps={{
                    tooltip: t('classification.group.tooltip.altName'),
                  }}
                />
                <FormStatusSwitch
                  name="status"
                  originalStatus={classification?.status}
                />
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default ClassificationGroupDetail
