import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { Button, Form, message, Modal } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import {
  useCreateDiscountDetailMutation,
  useGetClassificationGroupsQuery,
  useGetConceptsQuery,
  useGetDiscountDetailInfoQuery,
  useGetGuestTypesQuery,
  useGetRegionsQuery,
  useGetRestaurantsQuery,
  useUpdateDiscountDetailsMutation,
} from '@apis'
import { ReactComponent as CancelIcon } from '@assets/icons/Cancel.svg'
import AnimateIcon from '@components/elements/AnimateIcon'
import Spin from '@components/elements/Spin'
import {
  MoneyInputWithCheckbox,
  NumberInput,
  NumberInputWithCheckbox,
} from '@components/form/FormInput'
import FormSelect from '@components/form/FormSelect'
import useFilter from '@hooks/useFilter'
import usePagination from '@hooks/usePagination'
import {
  Concept,
  Discount,
  DiscountDetailCreateInputs,
  Region,
  Restaurant,
} from '@models'
import { confirm } from '@utils/modal'
import { getDirtyFields } from '@utils/object'
import Scrollable from '../../../../../../layout/Scrollable'

type Props = {
  visible: boolean
  discount: Pick<Discount, 'id' | 'name' | 'countType'>
  onClose: () => void
  discountDetailId?: number
  classificationId?: number
  isUpdatingParent?: boolean
  discountId?: number
  discountName?: string
}

export const DiscountDetailInfo: React.FC<Props> = ({
  visible,
  discount,
  onClose,
  discountDetailId,
  classificationId,
  isUpdatingParent,
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<DiscountDetailCreateInputs>({
    defaultValues: {},
  })
  const { handleSubmit, formState } = formMethods
  const { dirtyFields, isDirty } = formState

  const {
    data: discountDetail,
    remove,
    isFetching,
  } = useGetDiscountDetailInfoQuery(discountDetailId, {
    enabled: !!discountDetailId,
    onSuccess: data =>
      formMethods.reset({
        ...data,
        restaurantId: data.restaurant?.id,
        regionId: data.region?.id,
        conceptId: data.concept?.id,
        categoryId: data.category?.id,
      }),
    onError: (e: any) => {
      message.error({ content: e.message })
      onClose()
    },
  })

  useEffect(() => {
    return () => remove()
  }, [remove])

  const { mutate: createDiscountDetail, isLoading: isCreating } =
    useCreateDiscountDetailMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getDiscountDetails')
        message.success({ content: t('discount.detail.create.success') })
        onClose()
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { mutate: updateDiscountDetail, isLoading: isUpdating } =
    useUpdateDiscountDetailsMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getDiscountDetails')
        message.success({ content: t('discount.detail.update.success') })
        onClose()
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })

  const { data: categoryResponse, isLoading: isFetchingCategory } =
    useGetClassificationGroupsQuery(
      { parentId: classificationId },
      {
        enabled: !!classificationId,
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )

  const { data: guestTypeResponse, isLoading: isFetchingGuestType } =
    useGetGuestTypesQuery(
      {},
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )

  const handleSave = handleSubmit(data => {
    if (!discountDetailId) {
      createDiscountDetail({
        ...data,
        discountId: discount.id,
      })
    } else {
      updateDiscountDetail([
        {
          ...getDirtyFields(data, dirtyFields),
          id: discountDetailId,
          regionId: data.regionId || 0,
          conceptId: data.conceptId || 0,
          restaurantId: data.restaurantId || 0,
          categoryId: data.categoryId || 0,
        },
      ])
    }
  })

  // Concept
  const [concepts, setConcepts] = useState<Concept[]>([])
  const conceptPagination = usePagination()
  const conceptFilter = useFilter({
    goToFirstPage: () => conceptPagination.setOffset(0),
  })
  const { data: conceptResponse, isLoading: isFetchingConcepts } =
    useGetConceptsQuery(
      {
        limit: conceptPagination.limit,
        offset: conceptPagination.offset,
      },
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )
  useEffect(() => {
    setConcepts([...concepts, ...(conceptResponse?.concepts || [])])
  }, [conceptResponse])

  // Region
  const [regions, setRegions] = useState<Region[]>([])
  const regionPagination = usePagination()
  const regionFilter = useFilter({
    goToFirstPage: () => regionPagination.setOffset(0),
  })
  const { data: regionResponse, isLoading: isFetchingRegions } =
    useGetRegionsQuery(
      {
        limit: regionPagination.limit,
        offset: regionPagination.offset,
      },
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )

  useEffect(() => {
    setRegions([...regions, ...(regionResponse?.regions || [])])
  }, [regionResponse])

  // Restaurant
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const restaurantPagination = usePagination()
  const restaurantFilter = useFilter({
    goToFirstPage: () => restaurantPagination.setOffset(0),
  })
  const { data: restaurantResponse, isLoading: isFetchingRestaurants } =
    useGetRestaurantsQuery(
      {
        limit: restaurantPagination.limit,
        offset: restaurantPagination.offset,
      },
      {
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )

  useEffect(() => {
    setRestaurants([...restaurants, ...(restaurantResponse?.restaurants || [])])
  }, [restaurantResponse])

  const close = () => {
    if (isDirty) {
      return confirm(t('common.confirm.unsave'), 'primary', onClose)()
    }
    return onClose()
  }

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
        discountDetailId
          ? `${t('common.edit')} "${discount.name}"`
          : t('discount.detail.addNew')
      }
      footer={[
        <Button onClick={close}>{t('common.cancel')}</Button>,
        <Button
          type="primary"
          disabled={isFetching || !(Object.keys(dirtyFields).length !== 0)}
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
              {discount.countType === 0 ? (
                <NumberInput
                  name="amount"
                  label={t('discount.detail.amount')}
                  formItemProps={{
                    tooltip: t('discount.detail.tooltip.amount'),
                  }}
                  numberFormatProps={{
                    thousandSeparator: true,
                  }}
                />
              ) : (
                <NumberInput
                  name="percent"
                  label={t('discount.detail.percent')}
                  formItemProps={{
                    tooltip: t('discount.detail.tooltip.percent'),
                  }}
                />
              )}
              <NumberInput
                name="bonusPercentVal"
                label={t('discount.detail.bonusPercentVal')}
                formItemProps={{
                  tooltip: t('discount.detail.tooltip.bonusPercentVal'),
                }}
              />
              <FormSelect
                name="bonusType"
                label={t('discount.detail.bonusType')}
                formItemProps={{
                  tooltip: t('discount.detail.tooltip.bonusType'),
                }}
                options={[]}
                selectProps={{
                  placeholder: t('discount.detail.selectBonusType'),
                }}
              />
              <FormSelect
                name="regionId"
                label={t('region.region')}
                formItemProps={{ tooltip: t('discount.detail.tooltip.region') }}
                options={[
                  ...(discountDetail?.region
                    ? [
                        {
                          value: discountDetail.region.id,
                          label:
                            discountDetail.region?.name ||
                            `${discountDetail.region.id}`,
                        },
                      ]
                    : []),
                  ...regions.map(region => ({
                    label: region.name,
                    value: region.id,
                  })),
                ]}
                totalItem={regionResponse?.total}
                pagination={regionPagination}
                searchItems={search => {
                  setRegions([])
                  regionFilter.setSearch(search)
                }}
                selectProps={{
                  loading: isFetchingRegions,
                  placeholder: t('discount.detail.selectRegion'),
                  allowClear: true,
                }}
              />
              <FormSelect
                name="conceptId"
                label={t('concept.concept')}
                formItemProps={{
                  tooltip: t('discount.detail.tooltip.concept'),
                }}
                options={[
                  ...(discountDetail?.concept
                    ? [
                        {
                          value: discountDetail.concept.id,
                          label:
                            discountDetail.concept?.name ||
                            `${discountDetail.concept.id}`,
                        },
                      ]
                    : []),
                  ...concepts.map(concept => ({
                    label: concept.name,
                    value: concept.id,
                  })),
                ]}
                totalItem={conceptResponse?.total}
                pagination={conceptPagination}
                searchItems={search => {
                  setConcepts([])
                  conceptFilter.setSearch(search)
                }}
                selectProps={{
                  loading: isFetchingConcepts,
                  placeholder: t('discount.detail.selectConcept'),
                  allowClear: true,
                }}
              />
              <FormSelect
                name="restaurantId"
                label={t('restaurant.restaurant')}
                formItemProps={{
                  tooltip: t('discount.detail.tooltip.restaurant'),
                }}
                options={[
                  ...(discountDetail?.restaurant
                    ? [
                        {
                          value: discountDetail.restaurant.id,
                          label:
                            discountDetail.restaurant?.name ||
                            `${discountDetail.restaurant.id}`,
                        },
                      ]
                    : []),
                  ...restaurants.map(restaurant => ({
                    label: restaurant.name,
                    value: restaurant.id,
                  })),
                ]}
                totalItem={restaurantResponse?.total}
                pagination={restaurantPagination}
                searchItems={search => {
                  setRestaurants([])
                  restaurantFilter.setSearch(search)
                }}
                selectProps={{
                  loading: isFetchingRestaurants,
                  placeholder: t('discount.detail.selectRestaurant'),
                  allowClear: true,
                }}
              />
              <FormSelect
                name="guestType"
                label={t('discount.detail.guestType')}
                formItemProps={{
                  tooltip: t('discount.detail.tooltip.guestType'),
                }}
                options={[
                  ...(guestTypeResponse?.guestTypes || []).map(item => ({
                    label: item.name,
                    value: item.id,
                  })),
                ]}
                selectProps={{
                  loading: isFetchingGuestType,
                  placeholder: t('discount.detail.selectGuestType'),
                }}
              />
              {!!classificationId && (
                <FormSelect
                  name="categoryId"
                  label={t('discount.detail.category')}
                  formItemProps={{
                    tooltip: t('discount.detail.tooltip.category'),
                  }}
                  options={[
                    ...(categoryResponse?.classificatorGroups || []).map(
                      item => ({
                        label: item.name,
                        value: item.id,
                      })
                    ),
                  ]}
                  selectProps={{
                    loading: isFetchingCategory,
                    placeholder: t('discount.detail.selectCategory'),
                    allowClear: true,
                  }}
                />
              )}
              <MoneyInputWithCheckbox
                checkbox={{
                  name: 'useFromAmount',
                  label: `${t('discount.detail.fromAmount')}`,
                }}
                moneyInput={{
                  name: 'fromAmount',
                }}
              />
              <NumberInputWithCheckbox
                checkbox={{
                  name: 'useFromGuest',
                  label: `${t('discount.detail.fromGuest')}`,
                }}
                numberInput={{
                  name: 'fromGuest',
                  numberFormatProps: { decimalScale: 0 },
                  showUpDown: true,
                }}
              />
              <NumberInputWithCheckbox
                checkbox={{
                  name: 'useToGuest',
                  label: `${t('discount.detail.toGuest')}`,
                }}
                numberInput={{
                  name: 'toGuest',
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
  background-color: red;

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
