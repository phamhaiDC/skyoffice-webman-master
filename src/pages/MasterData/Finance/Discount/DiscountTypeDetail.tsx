import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { DiscountTypeCreateInputs } from 'models'
import {
  useCreateDiscountTypeMutation,
  useGetDiscountTypeDetailQuery,
  useUpdateDiscountTypesMutation,
} from '@apis'
import Spin from '@components/elements/Spin'
import { TreeDetailTitle } from '@components/elements/Title'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { FormItems, PageFormBody } from '@components/PageFormBody'
import { getDirtyFields } from '@utils/object'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

const DiscountTypeDetail = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = parseInt(useParams().id || '0', 10)
  const formMethods = useForm<DiscountTypeCreateInputs>()
  const isCreate = useMatch({
    path: `finance/discount-types/${id}/discount-types`,
  })
  const { handleSubmit, formState } = formMethods
  const { dirtyFields } = formState

  const backToListView = () => navigate(`/finance/discount-types/${id}`)

  const {
    data: discountType,
    isLoading: isFetching,
    remove,
  } = useGetDiscountTypeDetailQuery(id, {
    enabled: !!id && !isCreate,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createDiscountType, isLoading: isCreating } =
    useCreateDiscountTypeMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getDiscountTypes')
        backToListView()
        message.success({ content: t('discount.type.create.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateDiscountType, isLoading: isUpdating } =
    useUpdateDiscountTypesMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getDiscountTypes')
        backToListView()
        message.success({ content: t('discount.type.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (isCreate) {
      createDiscountType({
        ...data,
        parentId: id,
      })
    } else {
      updateDiscountType([{ ...getDirtyFields(data, dirtyFields), id }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={isCreate ? t('discount.type.addNew') : t('discount.type.detail')}
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
                    tooltip: t('discount.type.tooltip.name'),
                    required: true,
                  }}
                />
                <NumberInput
                  name="code"
                  label={t('common.field.code')}
                  formItemProps={{ tooltip: t('discount.type.tooltip.code') }}
                />
                <FormInput
                  name="altName"
                  label={t('common.field.altName')}
                  formItemProps={{
                    tooltip: t('discount.type.tooltip.altName'),
                  }}
                />
                <FormStatusSwitch
                  name="status"
                  originalStatus={discountType?.status}
                />
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default DiscountTypeDetail
