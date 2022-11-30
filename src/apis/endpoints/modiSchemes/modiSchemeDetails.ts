import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  GetModiSchemeDetailsResponse,
  ModiSchemeDetail,
  ModiSchemeDetailCreateInputs,
  ModiSchemeDetailsListParams,
  ModiSchemeDetailUpdateInputs,
} from '../../../models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetModiSchemeDetailsResponse
  getOne: ModiSchemeDetail
  create: ModiSchemeDetail
  update: ModiSchemeDetail
  delete: {}
}

type QueryKeys = {
  get: ['getModiSchemeDetails', ModiSchemeDetailsListParams]
  getOne: ['getModiSchemeDetail', number?]
}

type Variables = {
  create: ModiSchemeDetailCreateInputs
  update: ModiSchemeDetailUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/modischemedetails'

const modiSchemeDetails: API = {
  get: ({ queryKey: [, params] }) => request.get(PREFIX, { params }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: body => request.post(PREFIX, body),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetModiSchemeDetailsQuery = (
  params: ModiSchemeDetailsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) => useQuery(['getModiSchemeDetails', params], modiSchemeDetails.get, options)

export const useGetModiSchemeDetail = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getModiSchemeDetail', id], modiSchemeDetails.getOne, options)

export const useCreateModiSchemeDetailMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => useMutation(['createModiSchemeDetail'], modiSchemeDetails.create, options)

export const useUpdateModiSchemeDetailsMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => useMutation(['updateModiSchemeDetails'], modiSchemeDetails.update, options)

export const useDeleteModiSchemeDetailsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => useMutation(['deleteModiSchemeDetails'], modiSchemeDetails.delete, options)
