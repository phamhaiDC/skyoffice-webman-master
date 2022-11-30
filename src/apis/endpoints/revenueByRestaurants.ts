import { QueryFunction, useQuery } from 'react-query'
import { RevenuebyrestaurantsListParams } from 'models/swagger'
import { RevenueByRestaurantsResponse } from '@models'
import request from '../request'
import { QueryOptions } from '../types'

type Response = {
  get: RevenueByRestaurantsResponse
}

type QueryKeys = {
  get: ['revenueByRestaurants', RevenuebyrestaurantsListParams]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
}

const PREFIX = 'api/reports/revenuebyrestaurants'

const revenueByRestaurants: API = {
  get: ({ queryKey: [, { region, concept, restaurant, ...params }] }) =>
    request.get(PREFIX, {
      params: {
        ...params,
        region: region?.join(','),
        concept: concept?.join(','),
        restaurant: restaurant?.join(','),
      },
    }),
}

export const useGetRevenuebyrestaurantsQuery = (
  params: RevenuebyrestaurantsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['revenueByRestaurants', params], revenueByRestaurants.get, options)
