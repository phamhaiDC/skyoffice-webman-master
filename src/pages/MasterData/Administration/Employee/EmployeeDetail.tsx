import { useCallback, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { EmployeeCreateInputs } from 'models'
import {
  useCreateEmployeeMutation,
  useGetEmployeeDetailQuery,
  useUpdateEmployeesMutation,
} from '@apis'
import Spin from '@components/elements/Spin'
import { TreeDetailTitle } from '@components/elements/Title'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { FormItems, PageFormBody } from '@components/PageFormBody'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

const EmployeeDetail = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id, employeeId } = useParams()
  const parentId = parseInt(id || '0', 10)
  const selectedEmployeeId = parseInt(employeeId || '0', 10)
  const formMethods = useForm<EmployeeCreateInputs>()
  const { handleSubmit } = formMethods

  const backToListView = useCallback(
    () => navigate(`/administration/group-roles/${parentId}`),
    [navigate, parentId]
  )

  const {
    data: employee,
    isLoading: isFetching,
    remove,
  } = useGetEmployeeDetailQuery(selectedEmployeeId, {
    enabled: !!selectedEmployeeId,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createEmployee, isLoading: isCreating } =
    useCreateEmployeeMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getEmployees')
        backToListView()
        message.success({ content: t('employee.item.create.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateEmployee, isLoading: isUpdating } =
    useUpdateEmployeesMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getEmployees')
        backToListView()
        message.success({ content: t('employee.item.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (!selectedEmployeeId) {
      createEmployee({
        ...data,
        parentId,
      })
    } else {
      updateEmployee([{ ...data, id: selectedEmployeeId }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={
          employeeId ? t('employee.item.detail') : t('employee.item.addNew')
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
                    tooltip: t('employee.item.tooltip.name'),
                    required: true,
                  }}
                />
                <NumberInput
                  name="code"
                  label={t('common.field.code')}
                  formItemProps={{ tooltip: t('employee.item.tooltip.code') }}
                />
                <FormInput
                  name="altName"
                  label={t('common.field.altName')}
                  formItemProps={{
                    tooltip: t('employee.item.tooltip.altName'),
                  }}
                />
                <FormStatusSwitch
                  name="status"
                  originalStatus={employee?.status}
                />
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default EmployeeDetail
