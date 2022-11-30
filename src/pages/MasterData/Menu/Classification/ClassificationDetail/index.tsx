import { useCallback, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
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
import FormTextArea from '../../../../../components/form/FormTextArea'
// import { TabFields } from './Tabs'

const ClassificationDetail = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const classificationGroupId = parseInt(
    useParams().classificationGroupId || '0',
    10
  )
  const classificationId = parseInt(useParams().classificationId || '0', 10)
  const formMethods = useForm<ClassificationCreateInputs>()
  const { handleSubmit } = formMethods

  const backToListView = useCallback(
    () => navigate(`/menu/classification-groups/${classificationGroupId}`),
    [navigate, classificationGroupId]
  )

  const {
    data: classification,
    isLoading: isFetching,
    remove,
  } = useGetClassificationDetailQuery(classificationId, {
    enabled: !!classificationId,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createClassification, isLoading: isCreating } =
    useCreateClassificationMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getClassifications')
        backToListView()
        message.success({ content: t('classification.item.create.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateClassification, isLoading: isUpdating } =
    useUpdateClassificationsMutation({
      onSuccess: () => {
        if (classificationGroupId === 0) {
          queryClient.invalidateQueries('getClassificationGroups')
        } else {
          queryClient.invalidateQueries('getClassifications')
        }
        backToListView()
        message.success({ content: t('classification.item.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (!classificationId) {
      createClassification({
        ...data,
        parentId:
          classificationGroupId === 0 ? undefined : classificationGroupId,
      })
    } else {
      updateClassification([{ ...data, id: classificationId }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={
          classificationId
            ? t('classification.item.detail')
            : t('classification.item.addNew')
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
                    tooltip: t('classification.item.tooltip.name'),
                    required: true,
                  }}
                />
                <NumberInput
                  name="code"
                  label={t('common.field.code')}
                  formItemProps={{
                    tooltip: t('classification.item.tooltip.code'),
                  }}
                />
                <FormInput
                  name="altName"
                  label={t('common.field.altName')}
                  formItemProps={{
                    tooltip: t('classification.item.tooltip.altName'),
                  }}
                />
                <FormTextArea
                  name="description"
                  label={t('common.field.description')}
                  formItemProps={{
                    tooltip: t('classification.item.tooltip.description'),
                  }}
                />
                <FormStatusSwitch
                  name="status"
                  originalStatus={classification?.status}
                />
                {/* <TabFields prices={classification?.prices || []} /> */}
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default ClassificationDetail
