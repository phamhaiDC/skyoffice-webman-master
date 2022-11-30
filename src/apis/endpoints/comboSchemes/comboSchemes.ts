import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  ComboScheme,
  ComboSchemeCreateInputs,
  ComboSchemesListParams,
  ComboSchemeUpdateInputs,
  GetComboSchemesResponse,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetComboSchemesResponse
  getOne: ComboScheme
  create: ComboScheme
  update: ComboScheme
  delete: { deletedIds: number[] }
}

type QueryKeys = {
  get: ['getComboSchemes', ComboSchemesListParams]
  getOne: ['getComboSchemeDetail', number?]
}

type Variables = {
  create: ComboSchemeCreateInputs
  update: ComboSchemeUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/modischemes'

const comboscheme: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: body => request.post(PREFIX, body),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetComboSchemesQuery = (
  params: ComboSchemesListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getComboSchemes', params], comboscheme.get, {
    onError: () => {},
    ...options,
  })

export const useGetComboSchemeDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getComboSchemeDetail', id], comboscheme.getOne, options)

export const useCreateComboSchemeMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createComboScheme'], comboscheme.create, options)
}

export const useUpdateComboSchemesMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateComboSchemes'], comboscheme.update, options)
}

export const useDeleteComboSchemesMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteComboSchemes'], comboscheme.delete, options)
}
