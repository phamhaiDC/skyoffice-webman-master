import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  GetMenuGroupsResponse,
  MenuGroup,
  MenuGroupCreateInputs,
  MenuGroupsUpdateInputs,
} from '@models'
import { MenugroupsListParams } from '../../../models/swagger'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetMenuGroupsResponse
  getOne: MenuGroup
  create: MenuGroup
  update: MenuGroup
  delete: { deletedIds: number[] }
}

type QueryKeys = {
  get: ['getMenuGroups', MenugroupsListParams?]
  getOne: ['getMenuGroupDetail', number?]
}

type Variables = {
  create: MenuGroupCreateInputs
  update: MenuGroupsUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/categlist'

const modigroups: API = {
  get: ({ queryKey: [, params] }) =>
    request.get(PREFIX, {
      params: { ...params, status: params?.status?.join(',') },
    }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: body => request.post(PREFIX, body),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetMenuGroupsQuery = (
  params: MenugroupsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getMenuGroups', params], modigroups.get, {
    onError: () => {},
    ...options,
  })

export const useGetMenuGroupDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getMenuGroupDetail', id], modigroups.getOne, options)

export const useCreateMenuGroupMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createMenuGroup'], modigroups.create, options)
}

export const useUpdateMenuGroupsMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateMenuGroups'], modigroups.update, options)
}

export const useDeleteMenuGroupsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteMenuGroups'], modigroups.delete, options)
}
