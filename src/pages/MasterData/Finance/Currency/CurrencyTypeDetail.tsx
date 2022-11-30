import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { CurrencyTypeCreateInputs } from 'models'
import {
  useCreateCurrencyTypeMutation,
  useGetCurrencyTypeDetailQuery,
  useUpdateCurrencyTypesMutation,
} from '@apis'
import Spin from '@components/elements/Spin'
import { TreeDetailTitle } from '@components/elements/Title'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { FormItems, PageFormBody } from '@components/PageFormBody'
import { getDirtyFields } from '@utils/object'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

const CurrencyTypeDetail = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = parseInt(useParams().id || '0', 10)
  const formMethods = useForm<CurrencyTypeCreateInputs>()
  const isCreate = useMatch({
    path: `finance/currency-types/${id}/currency-types`,
  })
  const { handleSubmit, formState } = formMethods
  const { dirtyFields } = formState

  const backToListView = () => navigate(`/finance/currency-types/${id}`)

  const {
    data: currencyType,
    isLoading: isFetching,
    remove,
  } = useGetCurrencyTypeDetailQuery(id, {
    enabled: !!id && !isCreate,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createCurrencyType, isLoading: isCreating } =
    useCreateCurrencyTypeMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getCurrencyTypes')
        backToListView()
        message.success({ content: t('currency.type.create.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateCurrencyType, isLoading: isUpdating } =
    useUpdateCurrencyTypesMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getCurrencyTypes')
        backToListView()
        message.success({ content: t('currency.type.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (isCreate) {
      createCurrencyType({
        ...data,
        parentId: id,
      })
    } else {
      updateCurrencyType([{ ...getDirtyFields(data, dirtyFields), id }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={isCreate ? t('currency.type.addNew') : t('currency.type.detail')}
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
                    tooltip: t('currency.type.tooltip.name'),
                    required: true,
                  }}
                />
                <NumberInput
                  name="code"
                  label={t('common.field.code')}
                  formItemProps={{ tooltip: t('currency.type.tooltip.code') }}
                />
                <FormInput
                  name="altName"
                  label={t('common.field.altName')}
                  formItemProps={{
                    tooltip: t('currency.type.tooltip.altName'),
                  }}
                />
                <FormStatusSwitch
                  name="status"
                  originalStatus={currencyType?.status}
                />
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default CurrencyTypeDetail
