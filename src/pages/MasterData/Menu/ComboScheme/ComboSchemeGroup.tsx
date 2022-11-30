import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { ComboSchemeCreateInputs } from 'models'
import {
  useCreateComboSchemeMutation,
  useGetComboSchemeDetailQuery,
  useUpdateComboSchemesMutation,
} from '@apis'
import Spin from '@components/elements/Spin'
import { TreeDetailTitle } from '@components/elements/Title'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { FormItems, PageFormBody } from '@components/PageFormBody'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

const ComboSchemeGroup = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = parseInt(useParams().id || '0', 10)
  const formMethods = useForm<ComboSchemeCreateInputs>()
  const isCreate = useMatch({ path: `menu/combo-schemes/${id}/schemes` })
  const { handleSubmit } = formMethods

  const backToListView = () => navigate(`/menu/combo-schemes/${id}`)

  const {
    data: comboScheme,
    isLoading: isFetching,
    remove,
  } = useGetComboSchemeDetailQuery(id, {
    enabled: !!id && !isCreate,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createComboScheme, isLoading: isCreating } =
    useCreateComboSchemeMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getComboSchemes')
        backToListView()
        message.success({ content: t('comboScheme.create.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateComboScheme, isLoading: isUpdating } =
    useUpdateComboSchemesMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getComboSchemes')
        backToListView()
        message.success({ content: t('comboScheme.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (isCreate) {
      createComboScheme({
        ...data,
        parentId: id,
        modiSchemeType: 3,
      })
    } else {
      updateComboScheme([{ ...data, id }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={
          isCreate ? t('comboScheme.addNew') : t('comboScheme.detail.title')
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
                    tooltip: t('comboScheme.tooltip.name'),
                    required: true,
                  }}
                />
                <NumberInput
                  name="code"
                  label={t('common.field.code')}
                  formItemProps={{ tooltip: t('comboScheme.tooltip.code') }}
                />
                <FormInput
                  name="altName"
                  label={t('common.field.altName')}
                  formItemProps={{ tooltip: t('comboScheme.tooltip.altName') }}
                />
                <FormStatusSwitch
                  name="status"
                  originalStatus={comboScheme?.status}
                />
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default ComboSchemeGroup
