import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  ComboGroup,
  ComboGroupCreateInputs,
  ComboGroupUpdateInputs,
  GetComboGroupsResponse,
} from '@models'
import { ModigroupsListParams } from '../../../models/swagger'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetComboGroupsResponse
  getOne: ComboGroup
  create: ComboGroup
  update: ComboGroup
  delete: { deletedIds: number[] }
}

type QueryKeys = {
  get: ['getComboGroups', ModigroupsListParams?]
  getOne: ['getComboGroupDetail', number?]
}

type Variables = {
  create: ComboGroupCreateInputs
  update: ComboGroupUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/modigroups'

const combogroups: API = {
  get: ({ queryKey: [, params] }) =>
    request.get(PREFIX, {
      params: {
        ...params,
        modiGroupType: 1,
        status: params?.status?.join(','),
      },
    }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: body => request.post(PREFIX, body),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetComboGroupsQuery = (
  params: ModigroupsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getComboGroups', params], combogroups.get, {
    onError: () => {},
    ...options,
  })

export const useGetComboGroupDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getComboGroupDetail', id], combogroups.getOne, options)

export const useCreateComboGroupMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createComboGroup'], combogroups.create, options)
}

export const useUpdateComboGroupsMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateComboGroups'], combogroups.update, options)
}

export const useDeleteComboGroupsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteComboGroups'], combogroups.delete, options)
}
