import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { Button, Form, message, Modal } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import {
  useCreateModiSchemeDetailMutation,
  useGetModiGroupsQuery,
  useGetModiSchemeDetail,
  useUpdateModiSchemeDetailsMutation,
} from '@apis'
import { ReactComponent as CancelIcon } from '@assets/icons/Cancel.svg'
import AnimateIcon from '@components/elements/AnimateIcon'
import Spin from '@components/elements/Spin'
import { NumberInputWithCheckbox } from '@components/form/FormInput'
import FormTreeSelect from '@components/form/FormTreeSelect'
import { ModiScheme, ModiSchemeDetailCreateInputs } from '@models'
import { confirm } from '@utils/modal'
import { getDirtyFields } from '@utils/object'
import Scrollable from '../../../../../../layout/Scrollable'

type Props = {
  visible: boolean
  isUpdatingParent: boolean
  modiScheme: Pick<ModiScheme, 'id'>
  modiSchemeDetailId?: number
  onClose: () => void
}

export const ModiSchemeDetail: React.FC<Props> = ({
  visible,
  isUpdatingParent,
  modiScheme,
  modiSchemeDetailId,
  onClose,
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<ModiSchemeDetailCreateInputs>({
    defaultValues: {},
  })
  const { formState, handleSubmit } = formMethods
  const { isDirty, dirtyFields } = formState

  const close = () => {
    if (isDirty) {
      return confirm(t('common.confirm.unsave'), 'primary', onClose)()
    }
    return onClose()
  }

  const {
    data: modiSchemeDetail,
    remove,
    isFetching,
  } = useGetModiSchemeDetail(modiSchemeDetailId, {
    enabled: !!modiSchemeDetailId,
    onSuccess: data => {
      formMethods.reset({
        ...data,
        modiGroupId: data.modiGroup?.id,
      })
    },
    onError: (e: any) => {
      message.error({ content: e.message })
      onClose()
    },
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  const { data: modiGroupsResponse, isFetching: isFetchingModiGroups } =
    useGetModiGroupsQuery(
      {},
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )

  const { mutate: updateModiSchemeDetails, isLoading: isUpdating } =
    useUpdateModiSchemeDetailsMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getModiSchemeDetails')
        message.success({ content: t('modiScheme.detail.update.success') })
        onClose()
      },
      onError: (e: any) => {
        message.error({ content: e.message })
        onClose()
      },
    })

  const { mutate: createModiSchemeDetails, isLoading: isCreating } =
    useCreateModiSchemeDetailMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getModiSchemeDetails')
        message.success({ content: t('modiScheme.detail.create.success') })
        onClose()
      },
      onError: (e: any) => {
        message.error({ content: e.message })
        onClose()
      },
    })

  const handleSave = handleSubmit(data => {
    if (modiSchemeDetailId) {
      updateModiSchemeDetails([
        { ...getDirtyFields(data, dirtyFields), id: modiSchemeDetailId },
      ])
    } else {
      createModiSchemeDetails({
        ...data,
        modiSchemeId: modiScheme.id,
      })
    }
  })

  return (
    <StyledModal
      visible={visible}
      destroyOnClose
      closeIcon={
        <AnimateIcon
          activeColor={theme`colors.white`}
          bgColor={theme`colors.red.500`}
          onClick={close}
        >
          <CancelIcon />
        </AnimateIcon>
      }
      maskClosable={false}
      title={
        modiSchemeDetailId
          ? `${t('common.edit')} "${
              modiSchemeDetail?.modiGroup?.name
                ? modiSchemeDetail?.modiGroup?.name
                : ''
            }"`
          : t('modiScheme.detail.addNew')
      }
      footer={[
        <Button onClick={close}>{t('common.cancel')}</Button>,
        <Button
          type="primary"
          disabled={isFetching || !isDirty}
          loading={isCreating || isUpdating}
          onClick={handleSave}
        >
          {t('common.save')}
        </Button>,
      ]}
    >
      {isFetching || isUpdatingParent ? (
        <Spin />
      ) : (
        <FormProvider {...formMethods}>
          <Form layout="vertical">
            <StyledScrollable>
              <FormTreeSelect
                name="modiGroupId"
                label={t('modiScheme.detail.modiGroup')}
                formItemProps={{
                  tooltip: t('modiScheme.detail.tooltip.modiGroup'),
                }}
                flatOptions={
                  modiGroupsResponse?.modiGroups?.map(item => ({
                    ...item,
                    selectable: item.modiGroupType === 0,
                  })) || []
                }
                selectProps={{
                  placeholder: t('modiScheme.detail.selectModiGroup'),
                  disabled:
                    !!modiSchemeDetailId && !!modiSchemeDetail?.modiGroup,
                  loading: isFetchingModiGroups,
                }}
              />
              <NumberInputWithCheckbox
                checkbox={{
                  name: 'useUpLimit',
                  label: `${t('modiScheme.upLimit')}`,
                }}
                numberInput={{
                  name: 'upLimit',
                  numberFormatProps: { decimalScale: 0 },
                  showUpDown: true,
                }}
              />
              <NumberInputWithCheckbox
                checkbox={{
                  name: 'useDownLimit',
                  label: `${t('modiScheme.downLimit')}`,
                }}
                numberInput={{
                  name: 'downLimit',
                  numberFormatProps: { decimalScale: 0 },
                  showUpDown: true,
                  formItemProps: {
                    className: 'pb-4',
                  },
                }}
              />
            </StyledScrollable>
          </Form>
        </FormProvider>
      )}
    </StyledModal>
  )
}

const StyledModal = styled(Modal)`
  max-width: 32.5rem;
  top: 5.4rem;
  height: calc(100vh - 11.9rem);
  padding-bottom: 0;
  overflow: hidden;

  .ant-modal-header {
    ${tw`py-2 px-4`}
  }

  .ant-modal-content {
    ${tw`h-full`}
  }

  .ant-modal-close-x {
    ${tw`h-full flex items-center justify-end pr-4`}
  }

  .ant-modal-close {
    ${tw`h-[38px]`}
  }

  .ant-modal-body {
    height: calc(100% - 6rem + 1px);
    ${tw`p-0`}
  }

  .ant-modal-footer {
    height: 3.5rem;
    ${tw`flex items-center justify-end`}
  }
`

const StyledScrollable = styled(Scrollable)`
  height: calc(100vh - 196px - 38px - 56px - 1px);
  ${tw`pb-4 overflow-x-hidden`}
`
