import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { Form, message } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { PlusOutlined } from '@ant-design/icons'
import { useCreateDiscountMutation } from '@apis'
import FormInput from '@components/form/FormInput'
import FormRadioGroup from '@components/form/FormRadioGroup'
import AddModal from '@components/modals/Add'
import Upload from '@components/Upload'
import { DiscountCreateInputs, DiscountObjectType } from '@models'
import { lengthOfNameRule, requiredRule } from '@utils/rules'
import Scrollable from '../../../../../../layout/Scrollable'

type Props = {
  visible: boolean
  onClose: () => void
  setDiscountId: (id: number) => void
}

export const Add: React.FC<Props> = ({ visible, onClose, setDiscountId }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<DiscountCreateInputs>({
    defaultValues: {
      name: '',
      discountObjectType: 1,
    },
  })
  const { handleSubmit, formState } = formMethods
  const discountTypeId = parseInt(useParams().id || '0', 10)

  useEffect(() => {
    if (!visible) {
      formMethods.reset()
    }
  }, [visible])

  const { mutate: createDiscount, isLoading: isCreating } =
    useCreateDiscountMutation({
      onSuccess: data => {
        queryClient.invalidateQueries('getDiscounts')
        message.success({ content: t('discount.item.create.success') })
        onClose()
        setDiscountId(data.id)
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const close = () => {
    onClose()
  }

  const handleSave = handleSubmit(data => {
    createDiscount({
      ...data,
      parentId: discountTypeId,
    })
  })

  const name = formMethods.watch('name')

  return (
    <AddModal
      title={t('discount.item.addNewDiscount')}
      visible={visible}
      isCreating={isCreating}
      isDirty={formState.isDirty && !!name}
      onSave={handleSave}
      onClose={close}
    >
      <StyledScrollable>
        <FormProvider {...formMethods}>
          <Form layout="vertical">
            <Upload>
              <PlusOutlined className="text-gray-400" />
            </Upload>
            <FormRadioGroup
              name="discountObjectType"
              options={Object.entries(DiscountObjectType).map(
                ([key, value]) => ({
                  value: parseInt(key, 10),
                  label: t(`${value}`),
                })
              )}
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
                tooltip: t('discount.item.tooltip.name'),
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
