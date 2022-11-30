import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  DiscountDetail,
  DiscountDetailCreateInputs,
  DiscountDetailsListParams,
  DiscountDetailsUpdateInputs,
  GetDiscountDetailsResponse,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetDiscountDetailsResponse
  getOne: DiscountDetail
  create: DiscountDetail
  update: DiscountDetail
  delete: { deletedIds: number[] }
}

type QueryKeys = {
  get: ['getDiscountDetails', DiscountDetailsListParams]
  getOne: ['getDiscountDetailInfo', number?]
}

type Variables = {
  create: DiscountDetailCreateInputs
  update: DiscountDetailsUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/discountdetails'

const discountDetail: API = {
  get: ({ queryKey: [, params] }) => request.get(PREFIX, { params }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: body => request.post(PREFIX, body),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetDiscountDetailsQuery = (
  params: DiscountDetailsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) => useQuery(['getDiscountDetails', params], discountDetail.get, options)

export const useGetDiscountDetailInfoQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getDiscountDetailInfo', id], discountDetail.getOne, options)

export const useCreateDiscountDetailMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createDiscountDetail'], discountDetail.create, options)
}

export const useUpdateDiscountDetailsMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateDiscountDetails'], discountDetail.update, options)
}

export const useDeleteDiscountDetailsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteDiscountDetails'], discountDetail.delete, options)
}
