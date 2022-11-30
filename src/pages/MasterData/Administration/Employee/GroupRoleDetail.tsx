import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { GroupRoleCreateInputs } from 'models'
import {
  useCreateGroupRoleMutation,
  useGetGroupRoleDetailQuery,
  useUpdateGroupRolesMutation,
} from '@apis'
import Spin from '@components/elements/Spin'
import { TreeDetailTitle } from '@components/elements/Title'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { FormItems, PageFormBody } from '@components/PageFormBody'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

const GroupRoleDetail = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = parseInt(useParams().id || '0', 10)
  const formMethods = useForm<GroupRoleCreateInputs>()
  const isCreate = useMatch({
    path: `administration/group-roles/${id}/group-roles`,
  })
  const { handleSubmit } = formMethods

  const backToListView = () => navigate(`/administration/group-roles/${id}`)

  const {
    data: groupRole,
    isLoading: isFetching,
    remove,
  } = useGetGroupRoleDetailQuery(id, {
    enabled: !!id && !isCreate,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createGroupRole, isLoading: isCreating } =
    useCreateGroupRoleMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getGroupRoles')
        backToListView()
        message.success({ content: t('employee.group.create.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateGroupRole, isLoading: isUpdating } =
    useUpdateGroupRolesMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getGroupRoles')
        backToListView()
        message.success({ content: t('employee.group.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (isCreate) {
      createGroupRole({
        ...data,
        parentId: id,
      })
    } else {
      updateGroupRole([{ ...data, id }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={
          isCreate ? t('employee.group.addNew') : t('employee.group.detail')
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
                    tooltip: t('employee.group.tooltip.name'),
                    required: true,
                  }}
                />
                <NumberInput
                  name="code"
                  label={t('common.field.code')}
                  formItemProps={{ tooltip: t('employee.group.tooltip.code') }}
                />
                <FormInput
                  name="altName"
                  label={t('common.field.altName')}
                  formItemProps={{
                    tooltip: t('employee.group.tooltip.altName'),
                  }}
                />
                <FormStatusSwitch
                  name="status"
                  originalStatus={groupRole?.status}
                />
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default GroupRoleDetail
