import { QueryFunction, useQuery } from 'react-query'
import { RevenuebyDiscountsListParams } from 'models/swagger'
import { RevenueByDiscountsResponse } from '@models'
import request from '../request'
import { QueryOptions } from '../types'

type Response = {
  get: RevenueByDiscountsResponse
}

type QueryKeys = {
  get: ['getrevenuebydiscounts', RevenuebyDiscountsListParams]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
}

const PREFIX = 'api/reports/getrevenuebydiscounts'

const RevenueByDiscounts: API = {
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

export const useGetRevenuebyDiscountsQuery = (
  params: RevenuebyDiscountsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getrevenuebydiscounts', params], RevenueByDiscounts.get, options)
