import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { Button, Form, message } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { useGetComboDetailQuery, useUpdateCombosMutation } from '@apis'
import { ReactComponent as MoreIcon } from '@assets/icons/More.svg'
import AnimateIcon from '@components/elements/AnimateIcon'
import Name from '@components/elements/Name'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusDropdown from '@components/form/FormStatusDropdown'
import DetailModal from '@components/modals/Detail'
import { Action, Header, Left, Right } from '@components/modals/Layout'
import { ComboUpdateInputs, CommonStatus } from '@models'
import { lengthOfNameRule, requiredRule } from '@utils/rules'
import Scrollable from '../../../../../../../layout/Scrollable'
import TabFields from './Tabs'

type Props = {
  comboId: number
  onClose: () => void
}

export const Detail: React.FC<Props> = ({ comboId, onClose }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<ComboUpdateInputs>()
  const { watch, handleSubmit, formState } = formMethods
  const { dirtyFields } = formState

  const {
    data: combo,
    isFetching,
    remove,
  } = useGetComboDetailQuery(comboId, {
    enabled: !!comboId,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      message.error({ content: e.message })
      onClose()
    },
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  const { mutate: updateCombo, isLoading: isUpdating } =
    useUpdateCombosMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getCombos')
        onClose()
        message.success({ content: t('combo.item.update.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    updateCombo([{ ...data, id: comboId }])
  })

  const status = watch('status')

  return (
    <DetailModal
      visible={!!comboId}
      isUpdating={isUpdating}
      isLoading={isFetching}
      isDirty={Object.keys(dirtyFields).length !== 0}
      onSave={handleSave}
      onClose={onClose}
    >
      <FormProvider {...formMethods}>
        <Form layout="vertical" className="flex">
          <Left>
            <Header>
              <Name name={combo?.name} />
              <Action>
                <FormStatusDropdown
                  label={
                    status !== undefined ? t(`${CommonStatus[status]}`) : ''
                  }
                />
                <Button
                  icon={
                    <AnimateIcon activeColor={theme`colors.blue.500`}>
                      <MoreIcon className="flex" />
                    </AnimateIcon>
                  }
                  size="small"
                  className="flex justify-center items-center border-none"
                />
              </Action>
            </Header>
            <StyledScrollable>
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
              <FormInput
                name="altName"
                label={t('common.field.altName')}
                formItemProps={{
                  tooltip: t('combo.item.tooltip.altName'),
                }}
              />
              <NumberInput
                name="code"
                label={t('common.field.code')}
                formItemProps={{ tooltip: t('combo.item.tooltip.code') }}
              />
              <FormInput
                name="dish"
                label={t('combo.item.dish')}
                inputProps={{ readOnly: true, value: combo?.dish?.name }}
                formItemProps={{ tooltip: t('combo.item.tooltip.dish') }}
              />
            </StyledScrollable>
          </Left>
          <Right>
            <TabFields prices={combo?.priceTypes} />
          </Right>
        </Form>
      </FormProvider>
    </DetailModal>
  )
}

const StyledScrollable = styled(Scrollable)`
  overflow-x: hidden !important;
  height: calc(100vh - 96px - 38px - 56px - 16px);
  ${tw`!pl-4 !pt-0 !pr-8 mt-4`};
`
