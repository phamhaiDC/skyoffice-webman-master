import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { Form, message } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { useCreateModifierMutation } from '@apis'
import FormInput, { NumberInput } from '@components/form/FormInput'
import AddModal from '@components/modals/Add'
import { ModifierCreateInputs } from '@models'
import { lengthOfNameRule, requiredRule } from '@utils/rules'
import Scrollable from '../../../../../../layout/Scrollable'

type Props = {
  visible: boolean
  onClose: () => void
  setModifierId: (id: number) => void
}

export const Add: React.FC<Props> = ({ visible, onClose, setModifierId }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<ModifierCreateInputs>({
    defaultValues: {
      name: '',
      altName: '',
    },
  })
  const { id } = useParams()
  const parentId = parseInt(id || '0', 10)
  const { formState, handleSubmit } = formMethods
  const { isDirty, dirtyFields } = formState

  const { mutate: createModifier, isLoading: isCreating } =
    useCreateModifierMutation({
      onSuccess: data => {
        queryClient.invalidateQueries('getModifiers')
        message.success({ content: t('modifier.item.create.success') })
        onClose()
        setModifierId(data.id)
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    createModifier({
      ...data,
      parentId,
      status: 1,
    })
  })

  useEffect(() => {
    if (!visible) {
      formMethods.reset()
    }
  }, [formMethods, visible])

  return (
    <AddModal
      title={t('modifier.item.addNew')}
      visible={visible}
      isCreating={isCreating}
      isDirty={Object.keys(dirtyFields).length !== 0}
      onSave={handleSave}
      onClose={onClose}
    >
      <StyledScrollable>
        <FormProvider {...formMethods}>
          <Form layout="vertical">
            <FormInput
              name="name"
              label={t('common.field.name')}
              rules={{
                ...requiredRule,
                ...lengthOfNameRule,
              }}
              formItemProps={{
                required: true,
                tooltip: t('modifier.item.tooltip.name'),
              }}
            />
            <NumberInput
              name="code"
              label={t('common.field.code')}
              formItemProps={{ tooltip: t('modifier.item.tooltip.code') }}
            />
            <FormInput
              name="altName"
              label={t('common.field.altName')}
              formItemProps={{
                tooltip: t('modifier.item.tooltip.altName'),
              }}
            />
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
