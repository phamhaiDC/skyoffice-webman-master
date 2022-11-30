import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import { GuestTypesListParams } from 'models/swagger'
import {
  GetGuestTypesResponse,
  GuestType,
  GuestTypeCreateInputs,
  GuestTypeUpdateInputs,
} from '@models'
import request from '../request'
import { MutationOptions, QueryOptions } from '../types'

type Response = {
  get: GetGuestTypesResponse
  getOne: GuestType
  create: GuestType
  update: {}
  delete: {}
}

type QueryKeys = {
  get: ['getGuestTypes', GuestTypesListParams]
  getOne: ['getGuestTypeDetail', number?]
}

type Variables = {
  create: GuestTypeCreateInputs
  update: GuestTypeUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/guesttypes'

const guestType: API = {
  get: ({ queryKey: [, params] }) => request.get(PREFIX, { params }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetGuestTypesQuery = (
  params: GuestTypesListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) => useQuery(['getGuestTypes', params], guestType.get, options)

export const useGetGuestTypeDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getGuestTypeDetail', id], guestType.getOne, options)

export const useCreateGuestTypeMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createGuestType'], guestType.create, options)
}

export const useUpdateGuestTypesMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateGuestTypes'], guestType.update, options)
}

export const useDeleteGuestTypesMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteGuestTypes'], guestType.delete, options)
}
