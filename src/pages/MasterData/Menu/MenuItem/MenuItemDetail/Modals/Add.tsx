import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { Form, message } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { PlusOutlined } from '@ant-design/icons'
import { useCreateMenuItemMutation } from '@apis'
import FormInput from '@components/form/FormInput'
import FormRadioGroup from '@components/form/FormRadioGroup'
import AddModal from '@components/modals/Add'
import Upload from '@components/Upload'
import Scrollable from '@layout/Scrollable'
import { MenuItemCreateInputs } from '@models'
import { lengthOfNameRule, requiredRule } from '@utils/rules'
import FormTextArea from '../../../../../../components/form/FormTextArea'

type Props = {
  visible: boolean
  onClose: () => void
  setMenuItemId: (id: number) => void
}

export const Add: React.FC<Props> = ({ visible, onClose, setMenuItemId }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<MenuItemCreateInputs>({
    defaultValues: {
      name: '',
      saleObjectType: 0,
    },
  })
  const { handleSubmit, formState } = formMethods
  const parentId = parseInt(useParams().id || '0', 10)

  useEffect(() => {
    if (!visible) {
      formMethods.reset()
    }
  }, [visible])

  // const { data: taxGroupData, isLoading: isFetchingTaxGroup } =
  //   useGetTaxGroupsQuery(
  //     {},
  //     {
  //       onError: (e: any) => {
  //         message.error({ content: e.message })
  //       },
  //     }
  //   )

  // const { data: modiSchemesData, isLoading: isFetchingModiScheme } =
  //   useGetModiSchemesTreeViewQuery(
  //     {
  //       modiSchemeType: 0,
  //     },
  //     {
  //       onError: (e: any) => {
  //         message.error({ content: e.message })
  //       },
  //     }
  //   )

  const { mutateAsync: createMenuItem, isLoading: isCreating } =
    useCreateMenuItemMutation({
      onSuccess: data => {
        queryClient.invalidateQueries('getMenuItems')
        message.success({ content: t('menuItem.item.create.success') })
        onClose()
        setMenuItemId(data.id)
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    createMenuItem({
      ...data,
      parentId,
    })
  })

  const name = formMethods.watch('name')

  return (
    <AddModal
      title={t('menuItem.item.addNewMenuItem')}
      visible={visible}
      isCreating={isCreating}
      isDirty={formState.isDirty && !!name}
      onSave={handleSave}
      onClose={onClose}
    >
      <StyledScrollable>
        <FormProvider {...formMethods}>
          <Form layout="vertical">
            <Upload>
              <PlusOutlined className="text-gray-400" />
            </Upload>
            <FormRadioGroup
              name="saleObjectType"
              options={[
                {
                  value: 0,
                  label: `${t('menuItem.item.type.dish')}`,
                },
                {
                  value: 2,
                  label: `${t('menuItem.item.type.combo')}`,
                },
              ]}
            />
            <FormInput
              name="name"
              label={t('common.field.name')}
              rules={{
                ...requiredRule,
                ...lengthOfNameRule,
              }}
              formItemProps={{
                required: true,
                tooltip: t('menuItem.item.tooltip.name'),
              }}
            />
            <FormTextArea
              name="description"
              label={t('common.field.description')}
              formItemProps={{
                tooltip: t('menuItem.item.tooltip.description'),
              }}
            />
            {/* <FormSelect
              name="taxDishType"
              label={t('menuItem.item.taxDishType')}
              formItemProps={{
                tooltip: t('menuItem.tooltip.taxDishType'),
              }}
              options={[
                ...(taxGroupData?.taxGroups || []).map(taxDish => ({
                  label: taxDish.name,
                  value: taxDish.id,
                  description: taxDish.description,
                })),
              ]}
              selectProps={{
                loading: isFetchingTaxGroup,
                placeholder: t('menuItem.selectTaxDishType'),
              }}
            />
            <FormTreeSelect
              name="modiSchemeId"
              label={t('menuItem.item.modiScheme')}
              formItemProps={{
                tooltip: t('menuItem.tooltip.modiScheme'),
              }}
              flatOptions={(modiSchemesData?.modiSchemes || []).map(item => ({
                ...item,
                description: '12324412',
              }))}
              selectProps={{
                placeholder: t('menuItem.selectModiScheme'),
                loading: isFetchingModiScheme,
              }}
            /> */}
          </Form>
        </FormProvider>
      </StyledScrollable>
    </AddModal>
  )
}

const StyledScrollable = styled(Scrollable)`
  max-height: 50vh;
  ${tw`px-8 py-4`};
`
