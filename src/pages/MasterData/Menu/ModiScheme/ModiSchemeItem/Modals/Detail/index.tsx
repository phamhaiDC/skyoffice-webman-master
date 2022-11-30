import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { Button, Form, message } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import {
  useGetModiSchemeDetailQuery,
  useUpdateModiSchemesMutation,
} from '@apis'
import { ReactComponent as MoreIcon } from '@assets/icons/More.svg'
import CollapseTab from '@components/CollapseTab'
import AnimateIcon from '@components/elements/AnimateIcon'
import Name from '@components/elements/Name'
import FormInput, {
  NumberInput,
  NumberInputWithCheckbox,
} from '@components/form/FormInput'
import FormStatusDropdown from '@components/form/FormStatusDropdown'
import DetailModal from '@components/modals/Detail'
import { Action, Header, Left, Right } from '@components/modals/Layout'
import { CommonStatus, ModiSchemeUpdateInputs } from '@models'
import { getDirtyFields } from '@utils/object'
import { lengthOfNameRule, requiredRule } from '@utils/rules'
import Scrollable from '../../../../../../../layout/Scrollable'
import { TabFields } from './Tabs'

type Props = {
  modiSchemeId: number
  onClose: () => void
}

export const Detail: React.FC<Props> = ({ modiSchemeId, onClose }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<ModiSchemeUpdateInputs>()
  const { formState, handleSubmit, watch } = formMethods
  const { isDirty, dirtyFields } = formState

  const {
    data: modiScheme,
    isFetching,
    remove,
  } = useGetModiSchemeDetailQuery(modiSchemeId, {
    enabled: !!modiSchemeId,
    onSuccess: formMethods.reset,
    onError: (e: any) => {
      message.error({ content: e.message })
      onClose()
    },
  })

  const { mutate: updateModiScheme, isLoading: isUpdating } =
    useUpdateModiSchemesMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getModiSchemes')
        message.success({ content: t('modiScheme.update.success') })
        onClose()
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateModiSchemeParent, isLoading: isUpdatingParent } =
    useUpdateModiSchemesMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getModiSchemes')
        message.success({ content: t('modiScheme.update.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  useEffect(() => {
    return () => remove()
  }, [remove])

  const handleSave = handleSubmit(data => {
    updateModiScheme([{ ...data, id: modiSchemeId }])
  })

  const handleSaveParent = handleSubmit(data => {
    if (isDirty) {
      formMethods.reset({ ...getDirtyFields(data, dirtyFields) })
      updateModiSchemeParent([
        { ...getDirtyFields(data, dirtyFields), id: modiSchemeId },
      ])
    }
  })

  const status = watch('status')

  return (
    <DetailModal
      visible={!!modiSchemeId}
      isDirty={isDirty}
      onClose={onClose}
      onSave={handleSave}
      isLoading={isFetching}
      isUpdating={isUpdating}
    >
      <FormProvider {...formMethods}>
        <Form layout="vertical" className="flex">
          <Left>
            <Header>
              <Name name={modiScheme?.name} />
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
              {/* <CollapseTab title={t('common.tab.basic')}>
                <NumberInput
                  name="freeCount"
                  label={t('modiScheme.freeCount')}
                />
                <NumberInput
                  name="sHQuantity"
                  label={t('modiScheme.sHQuantity')}
                />
                <NumberInputWithCheckbox
                  checkbox={{
                    name: 'useUpperLimit',
                    label: `${t('modiScheme.useUpperLimit')}`,
                  }}
                  numberInput={{
                    name: 'upperLimit',
                    numberFormatProps: { decimalScale: 0 },
                    showUpDown: true,
                  }}
                />
                <NumberInputWithCheckbox
                  checkbox={{
                    name: 'useDownLimit',
                    label: `${t('modiScheme.useDownLimit')}`,
                  }}
                  numberInput={{
                    name: 'downLimit',
                    numberFormatProps: { decimalScale: 0 },
                    showUpDown: true,
                  }}
                />
              </CollapseTab> */}
            </StyledScrollable>
          </Left>
          <Right>
            <TabFields
              modiScheme={{
                ...modiScheme!,
                name: watch('name') || '',
                useUpperLimit: watch('useUpperLimit'),
              }}
              isUpdatingParent={isUpdatingParent}
              onSaveParent={handleSaveParent}
            />
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
