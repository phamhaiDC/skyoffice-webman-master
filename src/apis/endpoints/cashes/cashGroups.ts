import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  CashGroup,
  CashGroupCreateInputs,
  CashGroupsListParams,
  CashGroupUpdateInputs,
  GetCashGroupsResponse,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetCashGroupsResponse
  getOne: CashGroup
  create: CashGroup
  update: CashGroup
  delete: { deletedIds: number[] }
}

type QueryKeys = {
  get: ['getCashGroups', CashGroupsListParams]
  getOne: ['getCashGroupDetail', number?]
}

type Variables = {
  create: CashGroupCreateInputs
  update: CashGroupUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/cashgroups'
const PREFIX_TREE = 'api/restaurants/cashgroups'

const cashGroup: API = {
  get: ({ queryKey: [, params] }) =>
    request.get(PREFIX_TREE, {
      params: { ...params, status: params?.status?.join(',') },
    }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetCashGroupsQuery = (
  params: CashGroupsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) => useQuery(['getCashGroups', params], cashGroup.get, options)

export const useGetCashGroupDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getCashGroupDetail', id], cashGroup.getOne, options)

export const useCreateCashGroupMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createCashGroup'], cashGroup.create, options)
}

export const useUpdateCashGroupsMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateCashGroups'], cashGroup.update, options)
}

export const useDeleteCashGroupsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteCashGroups'], cashGroup.delete, options)
}
