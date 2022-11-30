import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  GetModiSchemesResponse,
  ModiScheme,
  ModiSchemeCreateInputs,
  ModiSchemesListParams,
  ModiSchemeUpdateInputs,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetModiSchemesResponse
  getOne: ModiScheme
  create: ModiScheme
  update: ModiScheme
  delete: { deletedIds: number[] }
}

type QueryKeys = {
  get: ['getModiSchemes', ModiSchemesListParams]
  getOne: ['getModiSchemeDetail', number?]
  getTree: ['getModiSchemesTreeView', ModiSchemesListParams]
}

type Variables = {
  create: ModiSchemeCreateInputs
  update: ModiSchemeUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
  getTree: QueryFunction<Response['get'], QueryKeys['getTree']>
}

const PREFIX = 'api/modischemes'

const modischeme: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: body => request.post(PREFIX, body),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
  getTree: ({ queryKey: [, params] }) =>
    request.get(`${PREFIX}/treeview`, { params }),
}

export const useGetModiSchemesQuery = (
  params: ModiSchemesListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getModiSchemes', params], modischeme.get, {
    onError: () => {},
    ...options,
  })

export const useGetModiSchemeDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getModiSchemeDetail', id], modischeme.getOne, options)

export const useCreateModiSchemeMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createModiScheme'], modischeme.create, options)
}

export const useUpdateModiSchemesMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateModiSchemes'], modischeme.update, options)
}

export const useDeleteModiSchemesMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteModiSchemes'], modischeme.delete, options)
}

export const useGetModiSchemesTreeViewQuery = (
  params: ModiSchemesListParams,
  options?: QueryOptions<Response['get'], QueryKeys['getTree']>
) =>
  useQuery(['getModiSchemesTreeView', params], modischeme.getTree, {
    onError: () => {},
    ...options,
  })
