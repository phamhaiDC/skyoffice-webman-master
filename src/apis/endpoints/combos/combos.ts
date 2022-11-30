import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  Combo,
  ComboCreateInputs,
  CombosListParams,
  ComboUpdateInputs,
  GetCombosResponse,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetCombosResponse
  getOne: Combo
  create: Combo
  update: Combo
  delete: { deletedIds: number[] }
}

type QueryKeys = {
  get: ['getCombos', CombosListParams]
  getOne: ['getComboDetail', number?]
}

type Variables = {
  create: ComboCreateInputs
  update: ComboUpdateInputs[]
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

const combo: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: body => request.post(PREFIX, body),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetCombosQuery = (
  params: CombosListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getCombos', params], combo.get, {
    onError: () => {},
    ...options,
  })

export const useGetComboDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getComboDetail', id], combo.getOne, options)

export const useCreateComboMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createCombo'], combo.create, options)
}

export const useUpdateCombosMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateCombos'], combo.update, options)
}

export const useDeleteCombosMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteCombos'], combo.delete, options)
}
