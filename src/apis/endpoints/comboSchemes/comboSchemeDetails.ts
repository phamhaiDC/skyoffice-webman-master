import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  ComboSchemeDetail,
  ComboSchemeDetailCreateInputs,
  ComboSchemeDetailsListParams,
  ComboSchemeDetailUpdateInputs,
  GetComboSchemeDetailsResponse,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetComboSchemeDetailsResponse
  getOne: ComboSchemeDetail
  create: ComboSchemeDetail
  update: ComboSchemeDetail
  delete: {}
}

type QueryKeys = {
  get: ['getComboSchemeDetails', ComboSchemeDetailsListParams]
  getOne: ['getComboSchemeDetail', number?]
}

type Variables = {
  create: ComboSchemeDetailCreateInputs
  update: ComboSchemeDetailUpdateInputs[]
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

export const useGetComboSchemeDetailsQuery = (
  params: ComboSchemeDetailsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) => useQuery(['getComboSchemeDetails', params], modiSchemeDetails.get, options)

export const useGetComboSchemeDetail = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getComboSchemeDetail', id], modiSchemeDetails.getOne, options)

export const useCreateComboSchemeDetailMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => useMutation(['createComboSchemeDetail'], modiSchemeDetails.create, options)

export const useUpdateComboSchemeDetailsMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) =>
  useMutation(['updateComboSchemeDetails'], modiSchemeDetails.update, options)

export const useDeleteComboSchemeDetailsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) =>
  useMutation(['deleteComboSchemeDetails'], modiSchemeDetails.delete, options)
