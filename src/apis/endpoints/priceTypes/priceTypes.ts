import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import { PriceTypesListParams } from 'models'
import {
  GetPriceTypesResponse,
  PriceType,
  PriceTypeCreateInputs,
  PriceTypeUpdateInputs,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetPriceTypesResponse
  getOne: PriceType
  create: PriceType
  update: PriceType
  delete: { deletedIds: number[] }
}

type QueryKeys = {
  get: ['getPriceTypes', PriceTypesListParams]
  getOne: ['getPriceTypeDetail', number?]
}

type Variables = {
  create: PriceTypeCreateInputs
  update: PriceTypeUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/pricetypes'

const priceType: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetPriceTypesQuery = (
  params: PriceTypesListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getPriceTypes', params], priceType.get, {
    onError: () => {},
    ...options,
  })

export const useGetPriceTypeDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getPriceTypeDetail', id], priceType.getOne, options)

export const useCreatePriceTypeMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createPriceType'], priceType.create, options)
}

export const useUpdatePriceTypesMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updatePriceTypes'], priceType.update, options)
}

export const useDeletePriceTypesMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deletePriceTypes'], priceType.delete, options)
}
