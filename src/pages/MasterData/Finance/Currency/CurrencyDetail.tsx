import { useCallback, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { CurrencyCreateInputs } from 'models'
import {
  useCreateCurrencyMutation,
  useGetCurrencyDetailQuery,
  useUpdateCurrenciesMutation,
} from '@apis'
import Spin from '@components/elements/Spin'
import { TreeDetailTitle } from '@components/elements/Title'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { FormItems, PageFormBody } from '@components/PageFormBody'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

const CurrencyDetail = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id, currencyId } = useParams()
  const parentId = parseInt(id || '0', 10)
  const selectedCurrencyId = parseInt(currencyId || '0', 10)
  const formMethods = useForm<CurrencyCreateInputs>()
  const { handleSubmit } = formMethods

  const backToListView = useCallback(
    () => navigate(`/finance/currency-types/${parentId}`),
    [navigate, parentId]
  )

  const {
    data: currency,
    isLoading: isFetching,
    remove,
  } = useGetCurrencyDetailQuery(selectedCurrencyId, {
    enabled: !!selectedCurrencyId,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createCurrency, isLoading: isCreating } =
    useCreateCurrencyMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getCurrencies')
        backToListView()
        message.success({ content: t('currency.item.create.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateCurrency, isLoading: isUpdating } =
    useUpdateCurrenciesMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getCurrencies')
        backToListView()
        message.success({ content: t('currency.item.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (!selectedCurrencyId) {
      createCurrency({ ...data, parentId })
    } else {
      updateCurrency([{ ...data, id: selectedCurrencyId }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={
          currencyId ? t('currency.item.detail') : t('currency.item.addNew')
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
                    tooltip: t('currency.item.tooltip.name'),
                    required: true,
                  }}
                />
                <NumberInput
                  name="code"
                  label={t('common.field.code')}
                  formItemProps={{ tooltip: t('currency.item.tooltip.code') }}
                />
                <FormInput
                  name="altName"
                  label={t('common.field.altName')}
                  formItemProps={{
                    tooltip: t('currency.item.tooltip.altName'),
                  }}
                />
                <FormStatusSwitch
                  name="status"
                  originalStatus={currency?.status}
                />
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default CurrencyDetail
