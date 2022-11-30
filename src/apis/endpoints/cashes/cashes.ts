import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  Cash,
  CashCreateInputs,
  CashesListParams,
  CashUpdateInputs,
  GetCashesResponse,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetCashesResponse
  getOne: Cash
  create: Cash
  update: Cash
  delete: {
    deletedIds: number[]
    rejecteds: any
  }
}

type QueryKeys = {
  get: ['getCashes', CashesListParams]
  getOne: ['getCashDetail', number?]
}

type Variables = {
  create: CashCreateInputs
  update: CashUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/cashes'

const cash: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetCashesQuery = (
  params: CashesListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getCashes', params], cash.get, {
    onError: () => {},
    ...options,
  })

export const useGetCashDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getCashDetail', id], cash.getOne, options)

export const useCreateCashMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createCash'], cash.create, options)
}

export const useUpdateCashesMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateCashes'], cash.update, options)
}

export const useDeleteCashesMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteCashes'], cash.delete, options)
}
