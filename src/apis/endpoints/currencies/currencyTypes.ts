import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import { CurrencyTypesListParams } from 'models'
import {
  CurrencyType,
  CurrencyTypeCreateInputs,
  CurrencyTypeUpdateInputs,
  GetCurrencyTypesResponse,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetCurrencyTypesResponse
  getOne: CurrencyType
  create: CurrencyType
  update: CurrencyType
  delete: {}
}

type QueryKeys = {
  get: ['getCurrencyTypes', CurrencyTypesListParams]
  getOne: ['getCurrencyTypeDetail', number?]
}

type Variables = {
  create: CurrencyTypeCreateInputs
  update: CurrencyTypeUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/currencytypes'

const currencyType: API = {
  get: ({ queryKey: [, params] }) =>
    request.get(PREFIX, {
      params: { ...params, status: params.status?.join(',') },
    }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetCurrencyTypesQuery = (
  params: CurrencyTypesListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) => useQuery(['getCurrencyTypes', params], currencyType.get, options)

export const useGetCurrencyTypeDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getCurrencyTypeDetail', id], currencyType.getOne, options)

export const useCreateCurrencyTypeMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createCurrencyType'], currencyType.create, options)
}

export const useUpdateCurrencyTypesMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateCurrencyTypes'], currencyType.update, options)
}

export const useDeleteCurrencyTypesMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteCurrencyTypes'], currencyType.delete, options)
}
