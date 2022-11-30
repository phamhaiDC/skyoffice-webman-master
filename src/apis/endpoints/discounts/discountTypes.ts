import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  DiscountType,
  DiscountTypeCreateInputs,
  DiscountTypesListParams,
  DiscountTypesUpdateInputs,
  GetDiscountTypesResponse,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetDiscountTypesResponse
  getOne: DiscountType
  create: DiscountType
  update: DiscountType
  delete: {
    deletedIds: number[]
    rejecteds: any
  }
}

type QueryKeys = {
  get: ['getDiscountTypes', DiscountTypesListParams]
  getOne: ['getDiscountTypeDetail', number?]
}

type Variables = {
  create: DiscountTypeCreateInputs
  update: DiscountTypesUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/discounttypes'

const discounttype: API = {
  get: ({ queryKey: [, params] }) =>
    request.get(PREFIX, {
      params: { ...params, status: params?.status?.join(',') },
    }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetDiscountTypesQuery = (
  params: DiscountTypesListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) => useQuery(['getDiscountTypes', params], discounttype.get, options)

export const useGetDiscountTypeDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getDiscountTypeDetail', id], discounttype.getOne, options)

export const useCreateDiscountTypeMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createDiscountType'], discounttype.create, options)
}

export const useUpdateDiscountTypesMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateDiscountTypes'], discounttype.update, options)
}

export const useDeleteDiscountTypesMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteDiscountTypes'], discounttype.delete, options)
}
