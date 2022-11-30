import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { ModiGroupCreateInputs } from 'models'
import {
  useCreateModiGroupMutation,
  useGetModiGroupDetailQuery,
  useUpdateModiGroupsMutation,
} from '@apis'
import Spin from '@components/elements/Spin'
import { TreeDetailTitle } from '@components/elements/Title'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { FormItems, PageFormBody } from '@components/PageFormBody'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

const ModiGroupDetail = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = parseInt(useParams().id || '0', 10)
  const formMethods = useForm<ModiGroupCreateInputs>()
  const isCreate = useMatch({ path: `menu/modi-groups/${id}/modi-groups` })
  const { handleSubmit } = formMethods

  const backToListView = () => navigate(`/menu/modi-groups/${id}`)

  const {
    data: modiGroup,
    isLoading: isFetching,
    remove,
  } = useGetModiGroupDetailQuery(id, {
    enabled: !!id && !isCreate,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createModiGroup, isLoading: isCreating } =
    useCreateModiGroupMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getModiGroups')
        backToListView()
        message.success({ content: t('modifier.group.create.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateModiGroup, isLoading: isUpdating } =
    useUpdateModiGroupsMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getModiGroups')
        backToListView()
        message.success({ content: t('modifier.group.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (isCreate) {
      createModiGroup({
        ...data,
        parentId: id,
      })
    } else {
      updateModiGroup([{ ...data, id }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={
          isCreate ? t('modifier.group.addNew') : t('modifier.group.detail')
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
                    tooltip: t('modifier.group.tooltip.name'),
                    required: true,
                  }}
                />
                <NumberInput
                  name="code"
                  label={t('common.field.code')}
                  formItemProps={{ tooltip: t('modifier.group.tooltip.code') }}
                />
                <FormInput
                  name="altName"
                  label={t('common.field.altName')}
                  formItemProps={{
                    tooltip: t('modifier.group.tooltip.altName'),
                  }}
                />
                <FormStatusSwitch
                  name="status"
                  originalStatus={modiGroup?.status}
                />
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default ModiGroupDetail
