import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { CashGroupCreateInputs } from 'models'
import {
  useCreateCashGroupMutation,
  useGetCashGroupDetailQuery,
  useUpdateCashGroupsMutation,
} from '@apis'
import Spin from '@components/elements/Spin'
import { TreeDetailTitle } from '@components/elements/Title'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { FormItems, PageFormBody } from '@components/PageFormBody'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

const CashGroupDetail = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = parseInt(useParams().id || '0', 10)
  const formMethods = useForm<CashGroupCreateInputs>()
  const isCreate = useMatch({
    path: `administration/cash-groups/${id}/cash-groups`,
  })
  const { handleSubmit } = formMethods

  const backToListView = () => navigate(`/administration/cash-groups/${id}`)

  const {
    data: cashGroup,
    isLoading: isFetching,
    remove,
  } = useGetCashGroupDetailQuery(id, {
    enabled: !!id && !isCreate,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createCashGroup, isLoading: isCreating } =
    useCreateCashGroupMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getCashGroups')
        backToListView()
        message.success({ content: t('cash.group.create.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateCashGroup, isLoading: isUpdating } =
    useUpdateCashGroupsMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getCashGroups')
        backToListView()
        message.success({ content: t('cash.group.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (isCreate) {
      createCashGroup({
        ...data,
        parentId: id,
      })
    } else {
      updateCashGroup([{ ...data, id }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={isCreate ? t('cash.group.addNew') : t('cash.group.detail')}
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
                    tooltip: t('cash.group.tooltip.name'),
                    required: true,
                  }}
                />
                <NumberInput
                  name="code"
                  label={t('common.field.code')}
                  formItemProps={{ tooltip: t('cash.group.tooltip.code') }}
                />
                <FormInput
                  name="altName"
                  label={t('common.field.altName')}
                  formItemProps={{ tooltip: t('cash.group.tooltip.altName') }}
                />
                <FormStatusSwitch
                  name="status"
                  originalStatus={cashGroup?.status}
                />
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default CashGroupDetail
