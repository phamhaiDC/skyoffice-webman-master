import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  GetRateClassesResponse,
  RateClass,
  RateClassCreateInputs,
  RateClassesListParams,
  RateClassUpdateInputs,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetRateClassesResponse
  getOne: RateClass
  create: RateClass
  update: RateClass
  delete: { deletedIds: number[] }
}

type QueryKeys = {
  get: ['getRateClasses', RateClassesListParams]
  getOne: ['getRateClassDetail', number?]
}

type Variables = {
  create: RateClassCreateInputs
  update: { id: number; data: RateClassUpdateInputs }
  delete: { ids: number[] }
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/rate-classes'

const rateClass: API = {
  get: ({ queryKey: [, params] }) => request.get(PREFIX, { params }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: ({ id, data }) => request.put(`${PREFIX}/${id}`, data),
  delete: async ({ ids }) => {
    const results = await Promise.allSettled(
      ids.map(id => request.delete(`${PREFIX}/${id}`))
    )
    const deletedIds = ids.filter(
      (_, index) => results[index].status === 'fulfilled'
    )

    return { deletedIds }
  },
}

export const useGetRateClassesQuery = (
  params: RateClassesListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getRateClasses', params], rateClass.get, {
    onError: () => {},
    ...options,
  })

export const useGetRateClassDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getRateClassDetail', id], rateClass.getOne, options)

export const useCreateRateClassMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createRateClass'], rateClass.create, options)
}

export const useUpdateRateClassMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateRateClass'], rateClass.update, options)
}

export const useDeleteRateClassesMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteRateClasses'], rateClass.delete, options)
}
