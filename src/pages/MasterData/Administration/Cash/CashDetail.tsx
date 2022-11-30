import { useCallback, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { CashCreateInputs } from 'models'
import {
  useCreateCashMutation,
  useGetCashDetailQuery,
  useUpdateCashesMutation,
} from '@apis'
import Spin from '@components/elements/Spin'
import { TreeDetailTitle } from '@components/elements/Title'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { FormItems, PageFormBody } from '@components/PageFormBody'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

const CashDetail = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id, cashId } = useParams()
  const parentId = parseInt(id || '0', 10)
  const selectedCashId = parseInt(cashId || '0', 10)
  const formMethods = useForm<CashCreateInputs>()
  const { handleSubmit } = formMethods

  const backToListView = useCallback(
    () => navigate(`/administration/cash-groups/${parentId}`),
    [navigate, parentId]
  )

  const {
    data: cash,
    isLoading: isFetching,
    remove,
  } = useGetCashDetailQuery(selectedCashId, {
    enabled: !!selectedCashId,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createCash, isLoading: isCreating } = useCreateCashMutation({
    onSuccess: () => {
      queryClient.invalidateQueries('getCashes')
      backToListView()
      message.success({ content: t('cash.item.create.success') })
    },
    onError: (e: any) => {
      message.error({ content: e.message })
    },
  })

  const { mutate: updateCash, isLoading: isUpdating } = useUpdateCashesMutation(
    {
      onSuccess: () => {
        queryClient.invalidateQueries('getCashes')
        backToListView()
        message.success({ content: t('cash.item.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    }
  )

  const handleSave = handleSubmit(data => {
    if (!selectedCashId) {
      createCash({
        ...data,
        parentId,
      })
    } else {
      updateCash([{ ...data, id: selectedCashId }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={cashId ? t('cash.item.detail') : t('cash.item.addNew')}
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
                    tooltip: t('cash.item.tooltip.name'),
                    required: true,
                  }}
                />
                <NumberInput
                  name="code"
                  label={t('common.field.code')}
                  formItemProps={{ tooltip: t('cash.item.tooltip.code') }}
                />
                <FormInput
                  name="altName"
                  label={t('common.field.altName')}
                  formItemProps={{ tooltip: t('cash.item.tooltip.altName') }}
                />
                <FormStatusSwitch name="status" originalStatus={cash?.status} />
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default CashDetail
