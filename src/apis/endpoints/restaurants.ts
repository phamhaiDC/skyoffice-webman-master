import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import { RestaurantsListParams } from 'models/swagger'
import {
  GetRestaurantsResponse,
  Restaurant,
  RestaurantCreateInputs,
  RestaurantUpdateInputs,
} from '@models'
import request from '../request'
import { MutationOptions, QueryOptions } from '../types'

type Response = {
  get: GetRestaurantsResponse
  getOne: Restaurant
  create: Restaurant
  update: {}
  delete: {}
}

type QueryKeys = {
  get: ['getRestaurants', RestaurantsListParams]
  getOne: ['getRestaurantDetail', number?]
}

type Variables = {
  create: RestaurantCreateInputs
  update: RestaurantUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/restaurants'

const restaurant: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetRestaurantsQuery = (
  params: RestaurantsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getRestaurants', params], restaurant.get, {
    onError: () => {},
    ...options,
  })

export const useGetRestaurantDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getRestaurantDetail', id], restaurant.getOne, options)

export const useCreateRestaurantMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createRestaurant'], restaurant.create, options)
}

export const useUpdateRestaurantsMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateRestaurant'], restaurant.update, options)
}

export const useDeleteRestaurantsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteRestaurants'], restaurant.delete, options)
}
