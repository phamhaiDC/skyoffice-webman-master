import { QueryFunction, useQuery } from 'react-query'
import { RevenueByEmployeesListParams } from 'models/swagger'
import { RevenueByEmployeesResponse } from '@models'
import request from '../request'
import { QueryOptions } from '../types'

type Response = {
  get: RevenueByEmployeesResponse
}

type QueryKeys = {
  get: ['getrevenuebyemployees', RevenueByEmployeesListParams]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
}

const PREFIX = 'api/reports/getrevenuebyemployees'

const revenuneByEmployees: API = {
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

export const useGetRevenuebyEmployeesQuery = (
  params: RevenueByEmployeesListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getrevenuebyemployees', params], revenuneByEmployees.get, options)
