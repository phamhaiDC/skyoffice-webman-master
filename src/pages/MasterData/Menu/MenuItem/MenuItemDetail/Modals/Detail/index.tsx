import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { Button, Col, Form, message, Row } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { PlusOutlined } from '@ant-design/icons'
import {
  useGetMenuItemDetailQuery,
  useGetMenuItemPictures,
  useGetModiSchemesTreeViewQuery,
  useGetTaxGroupsQuery,
  useUpdateMenuItemsMutation,
} from '@apis'
import { ReactComponent as ChefHatIcon } from '@assets/icons/ChefHat.svg'
import { ReactComponent as MoreIcon } from '@assets/icons/More.svg'
import { ReactComponent as UserEditIcon } from '@assets/icons/UserEdit.svg'
import AnimateIcon from '@components/elements/AnimateIcon'
import Name from '@components/elements/Name'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormSelect from '@components/form/FormSelect'
import FormStatusDropdown from '@components/form/FormStatusDropdown'
import FormTreeSelect from '@components/form/FormTreeSelect'
import DetailModal from '@components/modals/Detail'
import {
  Action,
  FadedText,
  Header,
  Left,
  Right,
} from '@components/modals/Layout'
import Rate from '@components/Rate'
import Upload from '@components/Upload'
import Scrollable from '@layout/Scrollable'
import { CommonStatus, MenuItemsUpdateInputs } from '@models'
import { getDirtyFields } from '@utils/object'
import { lengthOfNameRule, requiredRule } from '@utils/rules'
import FormTextArea from '../../../../../../../components/form/FormTextArea'
import TabFields from './Tabs'

type Props = {
  menuItemId: number
  onClose: () => void
}

export const Detail: React.FC<Props> = ({ menuItemId, onClose }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<MenuItemsUpdateInputs>()
  const { formState, handleSubmit, watch } = formMethods
  const { dirtyFields } = formState

  const {
    data: menuItem,
    isFetching,
    remove,
  } = useGetMenuItemDetailQuery(menuItemId, {
    enabled: !!menuItemId,
    onSuccess: data => {
      const { modiScheme, comboScheme, taxDishType, ...rest } = data
      formMethods.reset({
        ...rest,
        taxDishType: taxDishType || undefined,
        modiSchemeId: modiScheme?.id,
        comboSchemeId: comboScheme?.id,
      })
    },
    onError: (e: any) => {
      message.error({ content: e.message })
      onClose()
    },
  })
  const {
    data: dataPictures,
    // isFetching,
    // remove,
  } = useGetMenuItemPictures(
    { refId: menuItem?.refId || 0 },
    {
      // enabled: !!menuItemId,
      onSuccess: data => {
        // const { modiScheme, comboScheme, taxDishType, ...rest } = data
        // formMethods.reset({
        //   ...rest,
        //   taxDishType: taxDishType || undefined,
        //   modiSchemeId: modiScheme?.id,
        //   comboSchemeId: comboScheme?.id,
        // })
      },
      onError: (e: any) => {
        // message.error({ content: e.message })
        // onClose()
      },
    }
  )
  const { mutate: updateMenuItem, isLoading: isUpdating } =
    useUpdateMenuItemsMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getMenuItems')
        message.success({ content: t('menuItem.item.update.success') })
        onClose()
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { data: taxGroupData, isLoading: isFetchingTaxGroup } =
    useGetTaxGroupsQuery(
      {},
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )

  const { data: modiSchemesData, isLoading: isFetchingModiScheme } =
    useGetModiSchemesTreeViewQuery(
      {
        modiSchemeType: 0,
      },
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )

  const { data: comboSchemesData, isLoading: isFetchingComboScheme } =
    useGetModiSchemesTreeViewQuery(
      {
        modiSchemeType: 1,
      },
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )

  useEffect(() => {
    return () => remove()
  }, [remove])

  const handleSave = handleSubmit(data => {
    updateMenuItem([
      {
        ...getDirtyFields(data, dirtyFields),
        id: menuItemId,
        comboSchemeId:
          menuItem?.saleObjectType === 2 ? data.comboSchemeId || 0 : undefined,
        taxDishType: data.taxDishType || 0,
        modiSchemeId:
          menuItem?.saleObjectType === 0 ? data.modiSchemeId || 0 : undefined,
      },
    ])
  })

  const status = watch('status')

  return (
    <DetailModal
      visible={!!menuItemId}
      isLoading={isFetching}
      isUpdating={isUpdating}
      isDirty={Object.keys(dirtyFields).length !== 0}
      onClose={onClose}
      onSave={handleSave}
    >
      <FormProvider {...formMethods}>
        <Form layout="vertical" className="flex">
          <Left>
            <Header>
              <Name name={menuItem?.name} />
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
            <div className="flex flex-col gap-1 pt-1 pr-4 pb-4">
              <FadedText>Created by: Admin on 12-Jun-2022</FadedText>
              <Row>
                <Col span={12}>
                  <Rate rate={5} icon={<ChefHatIcon />} />
                </Col>
                <Col span={12} className="flex justify-end items-center">
                  <FadedText>Owner: Admin</FadedText>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Rate rate={3} icon={<UserEditIcon />} />
                </Col>
                <Col span={12} className="flex justify-end items-center">
                  <FadedText>{`Rating of ${
                    Math.floor(Math.random() * 1001) + 1000
                  } results`}</FadedText>
                </Col>
              </Row>
            </div>
            <StyledScrollable>
              <Upload name="image" className="mb-2">
                <PlusOutlined className="text-gray-400" />
              </Upload>
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
              <FormInput
                name="altName"
                label={t('common.field.altName')}
                formItemProps={{
                  tooltip: t('menuItem.item.tooltip.altName'),
                }}
              />
              <NumberInput
                name="code"
                label={t('common.field.code')}
                formItemProps={{ tooltip: t('menuItem.item.tooltip.code') }}
              />

              <div>
                {menuItem?.saleObjectType === 2 ? (
                  <FormTreeSelect
                    name="comboSchemeId"
                    label={t('comboScheme.comboSchemes')}
                    formItemProps={{
                      tooltip: t('menuItem.tooltip.comboscheme'),
                    }}
                    flatOptions={(comboSchemesData?.modiSchemes || []).map(
                      item => ({
                        ...item,
                        description: item.description,
                        selectable: item.modiSchemeType === 1,
                      })
                    )}
                    selectProps={{
                      loading: isFetchingComboScheme,
                      placeholder: t('menuItem.selectComboScheme'),
                      allowClear: true,
                    }}
                  />
                ) : (
                  <>
                    <FormSelect
                      name="taxDishType"
                      label={t('menuItem.item.taxDishType')}
                      formItemProps={{
                        required: true,
                        tooltip: t('menuItem.tooltip.taxDishType'),
                      }}
                      rules={{
                        ...requiredRule,
                        ...lengthOfNameRule,
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
                        allowClear: true,
                      }}
                      showDescription
                    />
                    <FormTreeSelect
                      name="modiSchemeId"
                      label={t('menuItem.item.modiScheme')}
                      formItemProps={{
                        tooltip: t('menuItem.tooltip.modiScheme'),
                      }}
                      flatOptions={(modiSchemesData?.modiSchemes || []).map(
                        item => ({
                          ...item,
                          description: item.description,
                          selectable: item.modiSchemeType === 0,
                        })
                      )}
                      selectProps={{
                        placeholder: t('menuItem.selectModiScheme'),
                        loading: isFetchingModiScheme,
                        allowClear: true,
                      }}
                    />
                  </>
                )}
                <NumberInput
                  name="modiWeight"
                  label={t('menuItem.item.modiWeight')}
                  numberFormatProps={{ decimalScale: 0 }}
                  showUpDown
                />
                <FormTextArea
                  name="description"
                  label={t('common.field.description')}
                  formItemProps={{
                    tooltip: t('menuItem.item.tooltip.description'),
                  }}
                />
              </div>
            </StyledScrollable>
          </Left>
          <Right>
            <TabFields
              pictures={dataPictures?.pictures || []}
              prices={menuItem?.priceTypes}
              classificatorGroups={menuItem?.classificatorGroups}
            />
          </Right>
        </Form>
      </FormProvider>
    </DetailModal>
  )
}

const StyledScrollable = styled(Scrollable)`
  overflow-x: hidden !important;
  height: calc(100vh - 17.625rem);
  ${tw`!pl-4 !pt-0 !pr-8`};
`
