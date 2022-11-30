import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { Button, Checkbox, Col, Form, message, Row } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { PlusOutlined } from '@ant-design/icons'
import {
  useGetClassificationGroupsQuery,
  useGetDiscountInfoQuery,
  useUpdateDiscountsMutation,
} from '@apis'
import { ReactComponent as MoreIcon } from '@assets/icons/More.svg'
import CollapseTab from '@components/CollapseTab'
import AnimateIcon from '@components/elements/AnimateIcon'
import Name from '@components/elements/Name'
import FormCheckbox from '@components/form/FormCheckbox'
import FormColorPicker from '@components/form/FormColorPicker'
import { DatePickerWithCheckbox } from '@components/form/FormDatePicker'
import FormInput, {
  MoneyInput,
  MoneyInputWithCheckbox,
  // MoneySelectWithCheckbox,
  NumberInput,
  SelectWithCheckbox,
} from '@components/form/FormInput'
import FormSelect from '@components/form/FormSelect'
import FormStatusDropdown from '@components/form/FormStatusDropdown'
import DetailModal from '@components/modals/Detail'
import { Action, Header, Left, Right } from '@components/modals/Layout'
import Upload from '@components/Upload'
import useFilter from '@hooks/useFilter'
import usePagination from '@hooks/usePagination'
import {
  Classification,
  CommonStatus,
  CountType,
  DiscountUpdateInputs,
  MinQuantityValue,
  RoundRule,
} from '@models'
import { getDirtyFields } from '@utils/object'
import { lengthOfNameRule, requiredRule } from '@utils/rules'
import Scrollable from '../../../../../../../layout/Scrollable'
import TabFields from './Tabs'

type Props = {
  discountId: number
  onClose: () => void
}

export const Detail: React.FC<Props> = ({ discountId, onClose }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<DiscountUpdateInputs>()
  const { formState, handleSubmit, watch } = formMethods
  const { dirtyFields, isDirty } = formState

  const [classifications, setClassifications] = useState<Classification[]>([])

  const classificationPagination = usePagination()
  const classificationFilter = useFilter({
    goToFirstPage: () => classificationPagination.setOffset(0),
  })

  const { data: classificationResponse, isLoading: isFetchingClassifications } =
    useGetClassificationGroupsQuery(
      { parentId: 0 },
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )

  const {
    data: discount,
    isFetching,
    remove,
  } = useGetDiscountInfoQuery(discountId, {
    enabled: !!discountId,
    onSuccess: data => {
      const { classification, ...rest } = data
      formMethods.reset({ ...rest, classificatorGroupId: classification?.id })
    },
    onError: (e: any) => {
      message.error({ content: e.message })
      onClose()
    },
  })

  const { mutate: updateDiscount, isLoading: isUpdating } =
    useUpdateDiscountsMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getDiscounts')
        message.success({ content: t('discount.item.update.success') })
        onClose()
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateDiscountParent, isLoading: isUpdatingParent } =
    useUpdateDiscountsMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getDiscounts')
        message.success({ content: t('discount.item.update.success') })
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const handleSaveParent = handleSubmit(data => {
    if (isDirty) {
      formMethods.reset({ ...getDirtyFields(data, dirtyFields) })
      updateDiscountParent([
        { ...getDirtyFields(data, dirtyFields), id: discountId },
      ])
    }
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  useEffect(() => {
    setClassifications([
      ...classifications,
      ...(classificationResponse?.classificatorGroups || []),
    ])
  }, [classificationResponse])

  const handleSave = handleSubmit(data => {
    updateDiscount([
      {
        ...getDirtyFields(data, dirtyFields),
        id: discountId,
        classificatorGroupId: data.classificatorGroupId || 0,
      },
    ])
  })

  const status = watch('status')

  return (
    <DetailModal
      visible={!!discountId}
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
              <Name name={discount?.name} />
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
              <Upload name="image" className="my-2">
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
                  tooltip: t('discount.item.tooltip.name'),
                }}
              />
              <FormInput
                name="altName"
                label={t('common.field.altName')}
                formItemProps={{
                  tooltip: t('discount.item.tooltip.altName'),
                }}
              />
              <NumberInput
                name="code"
                label={t('common.field.code')}
                formItemProps={{ tooltip: t('discount.item.tooltip.code') }}
              />
              <NumberInput
                name="extCode"
                label={t('discount.item.extCode')}
                formItemProps={{
                  tooltip: t('discount.item.tooltip.extCode'),
                }}
              />
              <CollapseTab title={t('common.tab.basic')}>
                <FormSelect
                  name="countType"
                  label={t('discount.item.countType.countType')}
                  formItemProps={{
                    tooltip: t('discount.item.tooltip.countType'),
                  }}
                  options={Object.entries(CountType).map(([key, value]) => ({
                    value: parseInt(key, 10),
                    label: t(`${value}`),
                  }))}
                />
                {watch('countType') === 0 ? (
                  <MoneyInputWithCheckbox
                    checkbox={{
                      name: 'useMaxAmount',
                      label: `${t('discount.item.maxAmount')}`,
                    }}
                    moneyInput={{
                      name: 'maxAmount',
                    }}
                  />
                ) : (
                  <MoneyInputWithCheckbox
                    checkbox={{
                      name: 'useMaxPercent',
                      label: `${t('discount.item.maxPercent')}`,
                    }}
                    moneyInput={{
                      name: 'maxPercent',
                    }}
                  />
                )}
                {watch('countType') === 0 ? (
                  <MoneyInputWithCheckbox
                    checkbox={{
                      name: 'useMaxPercent',
                      label: `${t('discount.item.maxPercent')}`,
                    }}
                    moneyInput={{
                      name: 'maxPercent',
                    }}
                  />
                ) : (
                  <SelectWithCheckbox
                    checkbox={{
                      name: 'useMinQuantity',
                      label: `${t('discount.item.minQuantity')}`,
                    }}
                    select={{
                      name: 'minQuantity',
                    }}
                    options={Object.entries(MinQuantityValue).map(
                      ([key, value]) => ({
                        value: parseInt(key, 4),
                        label: t(value),
                      })
                    )}
                  />
                )}
                <FormSelect
                  name="roundRule"
                  label={t('discount.item.roundRule.roundRule')}
                  formItemProps={{
                    tooltip: t('discount.item.tooltip.roundRule'),
                  }}
                  options={Object.entries(RoundRule).map(([key, value]) => ({
                    value: parseInt(key, 10),
                    label: value,
                  }))}
                />
                <Row>
                  <Col span={12}>
                    <FormCheckbox
                      name="manualEnterMode"
                      label={t('discount.item.manualEnterMode')}
                    />
                    <FormCheckbox
                      name="combineWithAnyDisc"
                      label={t('discount.item.combineWithAnyDisc')}
                    />
                    <FormCheckbox
                      name="actCharges"
                      label={t('discount.item.actCharges')}
                    />
                  </Col>
                  <Col span={12}>
                    <FormCheckbox
                      name="zeroAct"
                      label={t('discount.item.zeroAct')}
                    />
                    <FormCheckbox
                      name="printZeroValue"
                      label={t('discount.item.printZeroValue')}
                    />
                  </Col>
                </Row>
              </CollapseTab>
              <CollapseTab title={t('common.tab.restrictions')}>
                <Row>
                  <Col span={11}>
                    <FormCheckbox
                      name="onOrder"
                      label={t('discount.item.onOrder')}
                    />
                    <FormCheckbox
                      name="onDish"
                      label={t('discount.item.onDish')}
                    />
                    <FormCheckbox
                      name="onSeat"
                      label={t('discount.item.onSeat')}
                    />
                  </Col>
                  <Col span={1} />
                  <Col span={11}>
                    <FormCheckbox
                      name="allowMultiple"
                      label={t('discount.item.allowMultiple')}
                    />
                    <FormCheckbox
                      name="needMan"
                      label={t('discount.item.needMan')}
                    />
                    <FormCheckbox
                      name="prohibitHand"
                      label={t('discount.item.prohibitHand')}
                    />
                  </Col>
                </Row>
                <DatePickerWithCheckbox
                  checkbox={{
                    name: 'useStartSale',
                    label: `${t('discount.item.startSale')}`,
                  }}
                  datePicker={{
                    name: 'salesTerms_StartSale',
                  }}
                />
                <DatePickerWithCheckbox
                  checkbox={{
                    name: 'useStopSale',
                    label: `${t('discount.item.stopSale')}`,
                  }}
                  datePicker={{
                    name: 'salesTerms_StopSale',
                  }}
                />
                <FormSelect
                  name="classificatorGroupId"
                  label={t('discount.item.classification')}
                  formItemProps={{
                    tooltip: t('discount.item.tooltip.classification'),
                  }}
                  options={[
                    ...(discount?.classification
                      ? [
                          {
                            value: discount.classification.id,
                            label:
                              discount.classification?.name ||
                              `${discount.classification.id}`,
                          },
                        ]
                      : []),
                    ...classifications.map(classification => ({
                      label: classification.name,
                      value: classification.id,
                    })),
                  ]}
                  totalItem={classificationResponse?.total}
                  pagination={classificationPagination}
                  searchItems={search => {
                    setClassifications([])
                    classificationFilter.setSearch(search)
                  }}
                  selectProps={{
                    loading: isFetchingClassifications,
                    placeholder: t('discount.item.selectClassification'),
                    allowClear: true,
                  }}
                />
                <MoneyInput
                  name="minOrderRest"
                  label={t('discount.item.minOrderRest')}
                  formItemProps={{
                    tooltip: t('discount.item.tooltip.minOrderRest'),
                  }}
                />
              </CollapseTab>
              <CollapseTab title={t('common.tab.visualType')}>
                <Row>
                  <Col span={12}>
                    <FormColorPicker
                      name="visualType_BColor"
                      label={t('discount.item.visualTypeBColor')}
                    />
                  </Col>
                  <Col span={12}>
                    <FormColorPicker
                      name="visualType_TextColor"
                      label={t('discount.item.visualTypeTextColor')}
                    />
                  </Col>
                </Row>
              </CollapseTab>
            </StyledScrollable>
          </Left>
          <Right>
            <TabFields
              discount={{
                ...discount!,
                name: watch('name') || '',
                countType: watch('countType'),
              }}
              isUpdatingParent={isUpdatingParent}
              handleSaveParent={handleSaveParent}
            />
          </Right>
        </Form>
      </FormProvider>
    </DetailModal>
  )
}

const StyledScrollable = styled(Scrollable)`
  ${tw`!pl-4 !pt-0 !pr-8 overflow-x-hidden`};
  height: calc(100vh - 11.875rem);
`
