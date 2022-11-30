import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  Discount,
  DiscountCreateInputs,
  DiscountsListParams,
  DiscountUpdateInputs,
  GetDiscountsResponse,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetDiscountsResponse
  getOne: Discount
  create: Discount
  update: Discount
  delete: { deletedIds: number[] }
}

type QueryKeys = {
  get: ['getDiscounts', DiscountsListParams]
  getOne: ['getDiscountInfo', number?]
}

type Variables = {
  create: DiscountCreateInputs
  update: DiscountUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/discounts'

const discount: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: body => request.post(PREFIX, { ...body, status: 1 }),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetDiscountsQuery = (
  params: DiscountsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getDiscounts', params], discount.get, {
    onError: () => {},
    ...options,
  })

export const useGetDiscountInfoQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getDiscountInfo', id], discount.getOne, options)

export const useCreateDiscountMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createDiscount'], discount.create, options)
}

export const useUpdateDiscountsMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateDiscounts'], discount.update, options)
}

export const useDeleteDiscountsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteDiscounts'], discount.delete, options)
}
