import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { Form, message } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { useCreateModiSchemeMutation } from '@apis'
import FormInput, { NumberInput } from '@components/form/FormInput'
import AddModal from '@components/modals/Add'
import { ModiSchemeCreateInputs } from '@models'
import { lengthOfNameRule, requiredRule } from '@utils/rules'
import Scrollable from '../../../../../../layout/Scrollable'

type Props = {
  visible: boolean
  onClose: () => void
  setModiSchemeId: (id: number) => void
}

export const Add: React.FC<Props> = ({ visible, onClose, setModiSchemeId }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<ModiSchemeCreateInputs>()
  const { formState, handleSubmit } = formMethods
  const { isDirty, dirtyFields } = formState
  const { id } = useParams()
  const parentId = parseInt(id || '0', 10)

  const { mutateAsync: createModiScheme, isLoading: isCreating } =
    useCreateModiSchemeMutation({
      onSuccess: data => {
        queryClient.invalidateQueries('getModiSchemes')
        message.success({ content: t('modiScheme.create.success') })
        onClose()
        setModiSchemeId(data.id)
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  useEffect(() => {
    if (!visible) {
      formMethods.reset()
    }
  }, [formMethods, visible])

  const handleSave = handleSubmit(data => {
    createModiScheme({
      ...data,
      parentId,
      modiSchemeType: 0,
      status: 1,
    })
  })

  return (
    <AddModal
      visible={visible}
      title={t('modiScheme.addNew')}
      isDirty={Object.keys(dirtyFields).length !== 0}
      onClose={onClose}
      onSave={handleSave}
      isCreating={isCreating}
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
                tooltip: t('modiScheme.tooltip.name'),
                required: true,
              }}
            />
            <NumberInput
              name="code"
              label={t('common.field.code')}
              formItemProps={{ tooltip: t('modiScheme.tooltip.code') }}
            />
            <FormInput
              name="altName"
              label={t('common.field.altName')}
              formItemProps={{
                tooltip: t('modiScheme.tooltip.altName'),
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
