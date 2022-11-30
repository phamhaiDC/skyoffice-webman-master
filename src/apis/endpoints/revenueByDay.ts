import { QueryFunction, useQuery } from 'react-query'
import { RevenuebydaysListParams } from 'models/swagger'
import { GetRevenueByDaysResponse } from '@models'
import request from '../request'
import { QueryOptions } from '../types'

type Response = {
  get: GetRevenueByDaysResponse
}

type QueryKeys = {
  get: ['revenueByDays', RevenuebydaysListParams]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
}

const PREFIX = 'api/reports/revenuebydays'

const revenueByDays: API = {
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

export const useGetRevenuebydaysQuery = (
  params: RevenuebydaysListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) => useQuery(['revenueByDays', params], revenueByDays.get, options)
