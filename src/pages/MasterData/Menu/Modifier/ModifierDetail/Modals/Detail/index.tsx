import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { Button, Col, Form, message, Row } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { useGetModifierDetailQuery, useUpdateModifiersMutation } from '@apis'
import { ReactComponent as MoreIcon } from '@assets/icons/More.svg'
import AnimateIcon from '@components/elements/AnimateIcon'
import Name from '@components/elements/Name'
import FormCheckbox from '@components/form/FormCheckbox'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormStatusDropdown from '@components/form/FormStatusDropdown'
import DetailModal from '@components/modals/Detail'
import { Action, Header, Left, Right } from '@components/modals/Layout'
import { CommonStatus, ModifierUpdateInputs } from '@models'
import { getDirtyFields } from '@utils/object'
import { lengthOfNameRule, requiredRule } from '@utils/rules'
import Scrollable from '../../../../../../../layout/Scrollable'
import TabFields from './Tabs'

type Props = {
  modifierId: number
  onClose: () => void
}

export const Detail: React.FC<Props> = ({ modifierId, onClose }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<ModifierUpdateInputs>()
  const { watch, handleSubmit, formState } = formMethods
  const { isDirty, dirtyFields } = formState

  const {
    data: modifier,
    isFetching,
    remove,
  } = useGetModifierDetailQuery(modifierId, {
    enabled: !!modifierId,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      message.error({ content: e.message })
      onClose()
    },
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  const { mutate: updateModifier, isLoading: isUpdating } =
    useUpdateModifiersMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getModifiers')
        onClose()
        message.success({ content: t('modifier.item.update.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    updateModifier([
      {
        ...getDirtyFields(data, dirtyFields),
        id: modifierId,
      },
    ])
  })

  // const handleSave = handleSubmit(data => {
  //   updateModifier([{ ...data, id: modifierId }])
  // })

  const status = watch('status')

  return (
    <DetailModal
      visible={!!modifierId}
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
              <Name name={modifier?.name} />
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
                  tooltip: t('modifier.item.tooltip.name'),
                }}
              />
              <FormInput
                name="altName"
                label={t('common.field.altName')}
                formItemProps={{
                  tooltip: t('modifier.item.tooltip.altName'),
                }}
              />
              <NumberInput
                name="code"
                label={t('common.field.code')}
                formItemProps={{ tooltip: t('modifier.item.tooltip.code') }}
              />
              <Row>
                <Col span={12}>
                  <FormCheckbox
                    name="addToName"
                    label={t('modifier.item.addToName')}
                  />
                  <FormCheckbox
                    name="replaceName"
                    label={t('modifier.item.replaceName')}
                  />
                </Col>
                <Col span={12}>
                  <FormCheckbox
                    name="saveInReceipt"
                    label={t('modifier.item.saveInReceipt')}
                  />
                  <FormCheckbox
                    name="inputName"
                    label={t('modifier.item.inputName')}
                    tooltip={t('modifier.item.tooltip.inputName')}
                  />
                </Col>
              </Row>
            </StyledScrollable>
          </Left>
          <Right>
            <TabFields prices={modifier?.priceTypes} />
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
