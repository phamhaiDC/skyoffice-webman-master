import { QueryFunction, useQuery } from 'react-query'
import { HourlySaleByRestaurantsListParams } from 'models/swagger'
import { HourlySaleByRestaurantsResponse } from '@models'
import request from '../request'
import { QueryOptions } from '../types'

type Response = {
  get: HourlySaleByRestaurantsResponse
}

type QueryKeys = {
  get: ['gethourlysalebyrestaurants', HourlySaleByRestaurantsListParams]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
}

const PREFIX = 'api/reports/gethourlysalebyrestaurants'

const HourlySaleByRestaurants: API = {
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

export const useGetHourlySaleByRestaurantsQuery = (
  params: HourlySaleByRestaurantsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(
    ['gethourlysalebyrestaurants', params],
    HourlySaleByRestaurants.get,
    options
  )
