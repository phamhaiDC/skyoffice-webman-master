import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  GetRegionsResponse,
  Region,
  RegionCreateInputs,
  RegionUpdateInputs,
} from '@models'
import { RegionsListParams } from '../../models/swagger'
import request from '../request'
import { MutationOptions, QueryOptions } from '../types'

type Response = {
  get: GetRegionsResponse
  getOne: Region
  create: Region
  update: Region
  delete: {
    deletedIds: number[]
    rejecteds: any
  }
}

type QueryKeys = {
  get: ['getRegions', RegionsListParams]
  getOne: ['getRegionDetail', number?]
}

type Variables = {
  create: RegionCreateInputs
  update: RegionUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/regions'

const region: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetRegionsQuery = (
  params: RegionsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getRegions', params], region.get, {
    onError: () => {},
    ...options,
  })

export const useGetRegionDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getRegionDetail', id], region.getOne, options)

export const useCreateRegionMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createRegion'], region.create, options)
}

export const useUpdateRegionMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateRegion'], region.update, options)
}

export const useDeleteRegionsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteRegions'], region.delete, options)
}
