import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  GetTaxGroupsResponse,
  TaxGroup,
  TaxGroupCreateInputs,
  TaxGroupsListParams,
  TaxGroupUpdateInputs,
} from '@models'
import request from '../request'
import { MutationOptions, QueryOptions } from '../types'

type Response = {
  get: GetTaxGroupsResponse
  getOne: TaxGroup
  create: TaxGroup
  update: TaxGroup
  delete: {
    deletedIds: number[]
    rejecteds: any
  }
}

type QueryKeys = {
  get: ['getTaxGroups', TaxGroupsListParams]
  getOne: ['getTaxGroupDetail', number?]
}

type Variables = {
  create: TaxGroupCreateInputs
  update: TaxGroupUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/taxdishtypes'

const taxGroup: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetTaxGroupsQuery = (
  params: TaxGroupsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) => useQuery(['getTaxGroups', params], taxGroup.get, options)

export const useGetTaxGroupDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getTaxGroupDetail', id], taxGroup.getOne, options)

export const useCreateTaxGroupMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createTaxGroup'], taxGroup.create, options)
}

export const useUpdateTaxGroupsMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateTaxGroups'], taxGroup.update, options)
}

export const useDeleteTaxGroupsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteTaxGroups'], taxGroup.delete, options)
}
