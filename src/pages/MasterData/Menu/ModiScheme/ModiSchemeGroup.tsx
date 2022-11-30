import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { ModiSchemeCreateInputs } from 'models'
import {
  useCreateModiSchemeMutation,
  useGetModiSchemeDetailQuery,
  useUpdateModiSchemesMutation,
} from '@apis'
import Spin from '@components/elements/Spin'
import { TreeDetailTitle } from '@components/elements/Title'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { FormItems, PageFormBody } from '@components/PageFormBody'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

const ModiSchemeGroup = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = parseInt(useParams().id || '0', 10)
  const formMethods = useForm<ModiSchemeCreateInputs>()
  const isCreate = useMatch({ path: `menu/modifier-schemes/${id}/schemes` })
  const { handleSubmit } = formMethods

  const backToListView = () => navigate(`/menu/modifier-schemes/${id}`)

  const {
    data: modiScheme,
    isLoading: isFetching,
    remove,
  } = useGetModiSchemeDetailQuery(id, {
    enabled: !!id && !isCreate,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createModiScheme, isLoading: isCreating } =
    useCreateModiSchemeMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getModiSchemes')
        backToListView()
        message.success({ content: t('modiScheme.create.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateModiScheme, isLoading: isUpdating } =
    useUpdateModiSchemesMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getModiSchemes')
        backToListView()
        message.success({ content: t('modiScheme.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (isCreate) {
      createModiScheme({
        ...data,
        parentId: id,
        modiSchemeType: 2,
      })
    } else {
      updateModiScheme([{ ...data, id }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={isCreate ? t('modiScheme.addNew') : t('modiScheme.group.title')}
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
                    tooltip: t('modiScheme.tooltip.name'),
                    required: true,
                  }}
                />
                <NumberInput
                  name="code"
                  label={t('common.field.code')}
                  formItemProps={{ tooltip: t('modiScheme.tooltip.code') }}
                />
                <FormInput
                  name="altName"
                  label={t('common.field.altName')}
                  formItemProps={{ tooltip: t('modiScheme.tooltip.altName') }}
                />
                <FormStatusSwitch
                  name="status"
                  originalStatus={modiScheme?.status}
                />
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default ModiSchemeGroup
