import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import { CurrenciesListParams } from 'models/swagger'
import {
  Currency,
  CurrencyCreateInputs,
  CurrencyUpdateInputs,
  GetCurrenciesResponse,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetCurrenciesResponse
  getOne: Currency
  create: Currency
  update: Currency
  delete: {}
}

type QueryKeys = {
  get: ['getCurrencies', CurrenciesListParams]
  getOne: ['getCurrencyDetail', number?]
}

type Variables = {
  create: CurrencyCreateInputs
  update: CurrencyUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/currencies'

const currency: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetCurrenciesQuery = (
  params: CurrenciesListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) => useQuery(['getCurrencies', params], currency.get, options)

export const useGetCurrencyDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getCurrencyDetail', id], currency.getOne, options)

export const useCreateCurrencyMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createCurrency'], currency.create, options)
}

export const useUpdateCurrenciesMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateCurrencies'], currency.update, options)
}

export const useDeleteCurrenciesMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteCurrencies'], currency.delete, options)
}
