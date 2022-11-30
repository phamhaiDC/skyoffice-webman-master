import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  GetModifiersResponse,
  Modifier,
  ModifierCreateInputs,
  ModifiersListParams,
  ModifierUpdateInputs,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetModifiersResponse
  getOne: Modifier
  create: Modifier
  update: Modifier
  delete: { deletedIds: number[] }
}

type QueryKeys = {
  get: ['getModifiers', ModifiersListParams]
  getOne: ['getModifierDetail', number?]
}

type Variables = {
  create: ModifierCreateInputs
  update: ModifierUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/modifiers'

const modifier: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: body => request.post(PREFIX, body),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetModifiersQuery = (
  params: ModifiersListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getModifiers', params], modifier.get, {
    onError: () => {},
    ...options,
  })

export const useGetModifierDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getModifierDetail', id], modifier.getOne, options)

export const useCreateModifierMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createModifier'], modifier.create, options)
}

export const useUpdateModifiersMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateModifiers'], modifier.update, options)
}

export const useDeleteModifiersMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteModifiers'], modifier.delete, options)
}
