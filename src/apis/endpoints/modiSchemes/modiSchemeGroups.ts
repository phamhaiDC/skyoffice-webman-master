import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  GetModiGroupsResponse,
  ModiGroup,
  ModiGroupCreateInputs,
  ModiGroupUpdateInputs,
} from '@models'
import { ModigroupsListParams } from '../../../models/swagger'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetModiGroupsResponse
  getOne: ModiGroup
  create: ModiGroup
  update: ModiGroup
  delete: { deletedIds: number[] }
}

type QueryKeys = {
  get: ['getModiGroups', ModigroupsListParams?]
  getOne: ['getModiGroupDetail', number?]
}

type Variables = {
  create: ModiGroupCreateInputs
  update: ModiGroupUpdateInputs[]
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

const modigroups: API = {
  get: ({ queryKey: [, params] }) =>
    request.get(PREFIX, { params: { ...params, modiGroupType: 0 } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: body => request.post(PREFIX, body),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetModiGroupsQuery = (
  params: ModigroupsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getModiGroups', params], modigroups.get, {
    onError: () => {},
    ...options,
  })

export const useGetModiGroupDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getModiGroupDetail', id], modigroups.getOne, options)

export const useCreateModiGroupMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => useMutation(['createModiGroup'], modigroups.create, options)

export const useDeleteModiGroupsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => useMutation(['deleteModiGroups'], modigroups.delete, options)
