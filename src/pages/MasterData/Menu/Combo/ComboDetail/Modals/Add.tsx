import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { Form, Input, message } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { EllipsisOutlined } from '@ant-design/icons'
import { useCreateComboMutation } from '@apis'
import FormInput, { NumberInput } from '@components/form/FormInput'
import AddModal from '@components/modals/Add'
import { ComboCreateInputs, MenuItem } from '@models'
import { lengthOfNameRule, requiredRule } from '@utils/rules'
import FormInputWithButton from '../../../../../../components/form/FormInputWithButotn'
import Scrollable from '../../../../../../layout/Scrollable'
import { SelectDish } from './SelectDish'

type Props = {
  visible: boolean
  onClose: () => void
  setComboId: (id: number) => void
}
export const Add: React.FC<Props> = ({ visible, onClose, setComboId }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<ComboCreateInputs>({
    defaultValues: {
      name: '',
    },
  })
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<Pick<MenuItem, 'id' | 'name'>>()
  const { id } = useParams()
  const parentId = parseInt(id || '0', 10)
  const { formState, handleSubmit } = formMethods
  const { isDirty, dirtyFields } = formState
  const [visibleSelectDishModal, setVisibleSelectDishModal] = useState(false)
  const { mutate: createCombo, isLoading: isCreating } = useCreateComboMutation(
    {
      onSuccess: data => {
        queryClient.invalidateQueries('getCombos')
        message.success({ content: t('combo.item.create.success') })
        close()
        setComboId(data.id)
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  const close = () => {
    onClose()
    setSelectedMenuItem(undefined)
  }
  const handleSave = handleSubmit(data => {
    createCombo({
      ...data,
      parentId,
      status: 1,
      dishId: selectedMenuItem?.id,
    })
  })
  useEffect(() => {
    if (!visible) {
      formMethods.reset()
    }
  }, [formMethods, visible])

  return (
    <AddModal
      title={t('combo.item.addNew')}
      visible={visible}
      isCreating={isCreating}
      isDirty={Object.keys(dirtyFields).length !== 0}
      onSave={handleSave}
      onClose={close}
    >
      <StyledScrollable>
        <FormProvider {...formMethods}>
          <Form layout="vertical">
            <FormInputWithButton
              name="dish"
              label={t('combo.item.dish')}
              rules={{
                ...requiredRule,
                ...lengthOfNameRule,
              }}
              formItemProps={{
                required: true,
                tooltip: t('combo.item.tooltip.dish'),
              }}
              buttonProps={{ icon: <EllipsisOutlined /> }}
              handleClick={() => {
                setVisibleSelectDishModal(true)
              }}
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
                tooltip: t('combo.item.tooltip.name'),
              }}
            />
            <NumberInput
              name="code"
              label={t('common.field.code')}
              formItemProps={{ tooltip: t('combo.item.tooltip.code') }}
            />
            <FormInput
              name="altName"
              label={t('common.field.altName')}
              formItemProps={{
                tooltip: t('combo.item.tooltip.altName'),
              }}
            />
          </Form>
        </FormProvider>
      </StyledScrollable>
      <SelectDish
        visible={visibleSelectDishModal}
        onClose={() => {
          setVisibleSelectDishModal(false)
        }}
        // : Omit<MenuItem, 'status'>
        onOk={(value: any) => {
          setSelectedMenuItem(value)
          formMethods.setValue('name', value.name)
          formMethods.setValue('dish', value.name)
        }}
      />
    </AddModal>
  )
}

const StyledScrollable = styled(Scrollable)`
  max-height: 50vh;
  ${tw`px-8 py-4`};
`
