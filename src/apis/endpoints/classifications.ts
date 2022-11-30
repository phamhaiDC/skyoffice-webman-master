import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import { ClassificationsListParams } from 'models'
import {
  Classification,
  ClassificationCreateInputs,
  ClassificationUpdateInputs,
  GetClassificationsResponse,
} from '@models'
import request from '../request'
import { MutationOptions, QueryOptions } from '../types'

type Response = {
  get: GetClassificationsResponse
  getGroup: GetClassificationsResponse
  getOne: Classification
  create: Classification
  update: Classification
  delete: {}
}

type QueryKeys = {
  get: ['getClassifications', ClassificationsListParams]
  getGroup: ['getClassificationGroups', ClassificationsListParams]
  getOne: ['getClassificationDetail', number?]
}

type Variables = {
  create: ClassificationCreateInputs
  update: ClassificationUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getGroup: QueryFunction<Response['getGroup'], QueryKeys['getGroup']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/classificatorgroups'

const classification: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getGroup: ({ queryKey: [, params] }) =>
    request.get(PREFIX, {
      params: { ...params, status: params?.status?.join(',') },
    }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetClassificationsQuery = (
  params: ClassificationsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) => useQuery(['getClassifications', params], classification.get, options)

export const useGetClassificationGroupsQuery = (
  params: ClassificationsListParams,
  options?: QueryOptions<Response['getGroup'], QueryKeys['getGroup']>
) =>
  useQuery(
    ['getClassificationGroups', params],
    classification.getGroup,
    options
  )

export const useGetClassificationDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getClassificationDetail', id], classification.getOne, options)

export const useCreateClassificationMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createClassification'], classification.create, options)
}

export const useUpdateClassificationsMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateClassifications'], classification.update, options)
}

export const useDeleteClassificationsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteClassifications'], classification.delete, options)
}
