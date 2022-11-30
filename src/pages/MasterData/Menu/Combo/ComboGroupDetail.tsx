import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { ComboGroupCreateInputs } from 'models'
import {
  useCreateComboGroupMutation,
  useGetComboGroupDetailQuery,
  useUpdateComboGroupsMutation,
} from '@apis'
import Spin from '@components/elements/Spin'
import { TreeDetailTitle } from '@components/elements/Title'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { FormItems, PageFormBody } from '@components/PageFormBody'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

const ComboGroupDetail = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = parseInt(useParams().id || '0', 10)
  const formMethods = useForm<ComboGroupCreateInputs>()
  const isCreate = useMatch({ path: `menu/combo-groups/${id}/combo-groups` })
  const { handleSubmit } = formMethods

  const backToListView = () => navigate(`/menu/combo-groups/${id}`)

  const {
    data: comboGroup,
    isLoading: isFetching,
    remove,
  } = useGetComboGroupDetailQuery(id, {
    enabled: !!id && !isCreate,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createComboGroup, isLoading: isCreating } =
    useCreateComboGroupMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getComboGroups')
        backToListView()
        message.success({ content: t('combo.group.create.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateComboGroup, isLoading: isUpdating } =
    useUpdateComboGroupsMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getComboGroups')
        backToListView()
        message.success({ content: t('combo.group.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (isCreate) {
      createComboGroup({
        ...data,
        parentId: id,
        modiGroupType: 1,
      })
    } else {
      updateComboGroup([{ ...data, id }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={isCreate ? t('combo.group.addNew') : t('combo.group.detail')}
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
                    tooltip: t('combo.group.tooltip.name'),
                    required: true,
                  }}
                />
                <NumberInput
                  name="code"
                  label={t('common.field.code')}
                  formItemProps={{ tooltip: t('combo.group.tooltip.code') }}
                />
                <FormInput
                  name="altName"
                  label={t('common.field.altName')}
                  formItemProps={{ tooltip: t('combo.group.tooltip.altName') }}
                />
                <FormStatusSwitch
                  name="status"
                  originalStatus={comboGroup?.status}
                />
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default ComboGroupDetail
