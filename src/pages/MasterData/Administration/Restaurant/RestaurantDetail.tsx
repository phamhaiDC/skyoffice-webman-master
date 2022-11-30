import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { message } from 'antd'
import { Concept, Region, RestaurantCreateInputs } from 'models'
import {
  useCreateRestaurantMutation,
  useGetConceptsQuery,
  useGetRegionsQuery,
  useGetRestaurantDetailQuery,
  useUpdateRestaurantsMutation,
} from '@apis'
import DrawerDetail from '@components/DrawerDetail'
import FormInput, { NumberInput } from '@components/form/FormInput'
import FormSelect from '@components/form/FormSelect'
import FormStatusSwitch from '@components/form/FormStatusSwitch'
import FormDetail from '@components/FormDetail'
import useFilter from '@hooks/useFilter'
import usePagination from '@hooks/usePagination'
import { lengthOfNameRule, requiredRule } from '@utils/rules'

type RestaurantDetailProps = {
  visible: boolean
  onClose: () => void
  onCreateSuccess: () => void
  restaurantId?: number
}

const RestaurantDetail: React.FC<RestaurantDetailProps> = ({
  visible,
  onClose,
  onCreateSuccess,
  restaurantId,
}) => {
  const { t } = useTranslation()

  return (
    <DrawerDetail
      visible={visible}
      onClose={onClose}
      title={t('restaurant.detail')}
    >
      <RestaurantForm
        onClose={onClose}
        onCreateSuccess={onCreateSuccess}
        restaurantId={restaurantId}
      />
    </DrawerDetail>
  )
}

type RestaurantFormProps = {
  onClose: () => void
  onCreateSuccess: () => void
  restaurantId?: number
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({
  onClose,
  onCreateSuccess,
  restaurantId,
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const formMethods = useForm<RestaurantCreateInputs>({
    defaultValues: { status: 1 },
  })
  const { handleSubmit } = formMethods

  const regionPagination = usePagination()
  const regionFilter = useFilter({
    goToFirstPage: () => regionPagination.setOffset(0),
  })

  const [regions, setRegions] = useState<Region[]>([])
  const [concepts, setConcepts] = useState<Concept[]>([])

  const {
    data: restaurant,
    isLoading,
    remove,
  } = useGetRestaurantDetailQuery(restaurantId, {
    enabled: !!restaurantId,
    onSuccess: data =>
      formMethods.reset({
        ...data,
        regionId: data.region?.id,
        conceptId: data.concept?.id,
      }),
    onError: (e: any) => {
      onClose()
      message.error({ content: e.message })
    },
  })

  const { data: regionsResponse, isLoading: isFetchingRegions } =
    useGetRegionsQuery(
      {
        // limit: regionPagination.limit,
        offset: regionPagination.offset,
        search: regionFilter.search,
        status: [3],
      },
      {
        // onSuccess: data => setRegions([...regions, ...data.regions]),
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )
  const conceptPagination = usePagination()
  const conceptFilter = useFilter({
    goToFirstPage: () => conceptPagination.setOffset(0),
  })
  const { data: conceptsResponse, isLoading: isFetchingConcepts } =
    useGetConceptsQuery(
      {
        // limit: conceptPagination.limit,
        offset: conceptPagination.offset,
        search: conceptFilter.search,
        status: [3],
      },
      {
        // onSuccess: data => setRegions([...regions, ...data.regions]),
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )

  useEffect(() => {
    return () => remove()
  }, [remove])

  useEffect(() => {
    const data = regionsResponse?.regions
    if (data) {
      const activeRegionList = data.filter(region => region.status === 3)
      setRegions(activeRegionList)
    }
  }, [regionsResponse])

  useEffect(() => {
    const data = conceptsResponse?.concepts
    if (data) {
      const activeConceptList = data.filter(concept => concept.status === 3)
      setConcepts(activeConceptList)
    }
  }, [conceptsResponse])

  const { mutate: createRestaurant, isLoading: isCreating } =
    useCreateRestaurantMutation({
      onSuccess: () => {
        onClose()
        message.success({ content: t('restaurant.create.success') })
        queryClient.invalidateQueries('getRestaurants')
        onCreateSuccess()
      },
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    })
  const { mutate: updateRestaurant, isLoading: isUpdating } =
    useUpdateRestaurantsMutation({
      onSuccess: () => {
        queryClient.invalidateQueries('getRestaurants')
        onClose()
        message.success({ content: t('restaurant.update.success') })
      },
      onError: (e: any) => {
        onClose()
        message.error({ content: e.message })
      },
    })

  const handleSave = handleSubmit(data => {
    if (!restaurantId) {
      createRestaurant(data)
    } else {
      updateRestaurant([
        {
          ...data,
          id: restaurantId,
          conceptId: data.conceptId || 0,
          regionId: data.regionId || 0,
        },
      ])
    }
  })

  const removeAccents = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
  }
  return (
    <FormProvider {...formMethods}>
      <FormDetail
        isExecuting={isCreating || isUpdating}
        isFetching={isLoading}
        onCancel={onClose}
        onSave={handleSave}
      >
        <FormInput
          name="name"
          label={t('common.field.name')}
          rules={{
            ...requiredRule,
            ...lengthOfNameRule,
          }}
          formItemProps={{
            required: true,
            tooltip: t('restaurant.tooltip.name'),
          }}
        />
        <NumberInput
          name="code"
          label={t('common.field.code')}
          formItemProps={{ tooltip: t('restaurant.tooltip.code') }}
        />
        <FormInput
          name="altName"
          label={t('common.field.altName')}
          formItemProps={{ tooltip: t('restaurant.tooltip.altName') }}
        />
        <FormSelect
          name="regionId"
          label={t('region.region')}
          formItemProps={{ tooltip: t('restaurant.tooltip.region') }}
          options={[
            ...(restaurant?.region
              ? [
                  {
                    value: restaurant.region.id,
                    label:
                      restaurant.region?.name || `${restaurant.region.name}`,
                  },
                ]
              : []),
            ...regions.map(region => ({
              label: region.name,
              value: region.id,
            })),
          ]}
          totalItem={regionsResponse?.total}
          pagination={regionPagination}
          searchItems={search => {
            setRegions([])
            regionFilter.setSearch(search)
          }}
          selectProps={{
            loading: isFetchingRegions,
            placeholder: t('region.selectRegion'),
            allowClear: true,
            showSearch: true,
            filterOption: (input, option) => {
              return removeAccents(option?.label as unknown as string)
                .toLowerCase()
                .includes(removeAccents(input.toLocaleLowerCase()))
            },
          }}
        />
        <FormSelect
          name="conceptId"
          label={t('concept.concept')}
          formItemProps={{ tooltip: t('restaurant.tooltip.concept') }}
          options={[
            ...(restaurant?.concept
              ? [
                  {
                    value: restaurant.concept.id,
                    label:
                      restaurant.concept?.name || `${restaurant.concept.name}`,
                  },
                ]
              : []),
            ...concepts.map(concept => ({
              label: concept.name,
              value: concept.id,
            })),
          ]}
          totalItem={conceptsResponse?.total}
          pagination={conceptPagination}
          searchItems={search => {
            setConcepts([])
            conceptFilter.setSearch(search)
          }}
          selectProps={{
            loading: isFetchingConcepts,
            placeholder: t('concept.selectConcept'),
            allowClear: true,
            showSearch: true,
            filterOption: (input, option) => {
              return removeAccents(option?.label as unknown as string)
                .toLowerCase()
                .includes(removeAccents(input.toLocaleLowerCase()))
            },
          }}
        />
        <FormStatusSwitch name="status" originalStatus={restaurant?.status} />
      </FormDetail>
    </FormProvider>
  )
}

export default RestaurantDetail
