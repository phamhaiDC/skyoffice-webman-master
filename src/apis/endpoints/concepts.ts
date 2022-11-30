import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import { ConceptsListParams } from 'models/swagger'
import {
  Concept,
  ConceptCreateInputs,
  ConceptUpdateInputs,
  GetConceptsResponse,
} from '@models'
import request from '../request'
import { MutationOptions, QueryOptions } from '../types'

type Response = {
  get: GetConceptsResponse
  getOne: Concept
  create: Concept
  update: {}
  delete: {}
}

type QueryKeys = {
  get: ['getConcepts', ConceptsListParams]
  getOne: ['getConceptDetail', number?]
}

type Variables = {
  create: ConceptCreateInputs
  update: ConceptUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/concepts'

const concept: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetConceptsQuery = (
  params: ConceptsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) => useQuery(['getConcepts', params], concept.get, options)

export const useGetConceptDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getConceptDetail', id], concept.getOne, options)

export const useCreateConceptMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createConcept'], concept.create, options)
}

export const useUpdateConceptsMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateConcepts'], concept.update, options)
}

export const useDeleteConceptsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteConcepts'], concept.delete, options)
}
