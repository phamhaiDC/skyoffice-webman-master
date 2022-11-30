import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  GetGroupRolesResponse,
  GroupRole,
  GroupRoleCreateInputs,
  GroupRolesListParams,
  GroupRoleUpdateInputs,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetGroupRolesResponse
  getOne: GroupRole
  create: GroupRole
  update: GroupRole
  delete: number[]
}

type QueryKeys = {
  get: ['getGroupRoles', GroupRolesListParams]
  getOne: ['getGroupRoleDetail', number?]
}

type Variables = {
  create: GroupRoleCreateInputs
  update: GroupRoleUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/roles'
const PREFIX_TREE = 'api/restaurants/roles'

const groupRole: API = {
  get: ({ queryKey: [, params] }) =>
    request.get(PREFIX_TREE, {
      params: { ...params, status: params.status?.join(',') },
    }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetGroupRolesQuery = (
  params: GroupRolesListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getGroupRoles', params], groupRole.get, {
    onError: () => {},
    ...options,
  })

export const useGetGroupRoleDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getGroupRoleDetail', id], groupRole.getOne, options)

export const useCreateGroupRoleMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createGroupRole'], groupRole.create, options)
}

export const useUpdateGroupRolesMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateGroupRoles'], groupRole.update, options)
}

export const useDeleteGroupRolesMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteGroupRoles'], groupRole.delete, options)
}
