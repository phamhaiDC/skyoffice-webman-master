import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { MenuGroupCreateInputs } from 'models'
import {
  useCreateMenuGroupMutation,
  useGetMenuGroupDetailQuery,
  useUpdateMenuGroupsMutation,
} from '@apis'
import Spin from '@components/elements/Spin'
import { TreeDetailTitle } from '@components/elements/Title'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import { FormItems, PageFormBody } from '@components/PageFormBody'
import { lengthOfNameRule, requiredRule } from '@utils/rules'
import FormTextArea from '../../../../components/form/FormTextArea'

type Props = {
  setMenuItemsTitle: (params: string) => void
  menuItemsTitle: string
}
const MenuGroupDetail: React.FC<Props> = ({
  setMenuItemsTitle,
  menuItemsTitle,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = parseInt(useParams().id || '0', 10)
  const formMethods = useForm<MenuGroupCreateInputs>()
  const isCreate = useMatch({ path: `menu/menu-groups/${id}/menu-groups` })
  const { handleSubmit, formState } = formMethods
  const { dirtyFields } = formState

  const backToListView = () => navigate(`/menu/menu-groups/${id}`)

  const {
    data: menuGroup,
    isLoading: isFetching,
    remove,
  } = useGetMenuGroupDetailQuery(id, {
    enabled: !!id && !isCreate,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      backToListView()
      message.error({ content: e.message })
    },
  })

  const { mutate: createMenuGroup, isLoading: isCreating } =
    useCreateMenuGroupMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getMenuGroups')
        backToListView()
        message.success({ content: t('menuItem.group.create.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateMenuGroup, isLoading: isUpdating } =
    useUpdateMenuGroupsMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getMenuGroups')
        backToListView()
        message.success({ content: t('menuItem.group.update.success') })
      },
      onError: (e: any) => {
        backToListView()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (isCreate) {
      createMenuGroup({
        ...data,
        parentId: id,
      })
    } else {
      setMenuItemsTitle(data.description!)
      updateMenuGroup([{ ...data, id }])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  return (
    <>
      <TreeDetailTitle
        title={
          isCreate ? t('menuItem.group.addNew') : t('menuItem.group.detail')
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
                <FormTextArea
                  name="description"
                  label={t('common.field.description')}
                  formItemProps={{
                    tooltip: t('modifier.group.tooltip.description'),
                  }}
                />
                <FormStatusSwitch
                  name="status"
                  originalStatus={menuGroup?.status}
                />
              </FormItems>
            </FormDetail>
          </PageFormBody>
        )}
      </FormProvider>
    </>
  )
}

export default MenuGroupDetail
