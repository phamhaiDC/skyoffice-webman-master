import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  Employee,
  EmployeeCreateInputs,
  EmployeesListParams,
  EmployeeUpdateInputs,
  GetEmployeesResponse,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetEmployeesResponse
  getOne: Employee
  create: Employee
  update: Employee
  delete: number[]
}

type QueryKeys = {
  get: ['getEmployees', EmployeesListParams]
  getOne: ['getEmployeeDetail', number?]
}

type Variables = {
  create: EmployeeCreateInputs
  update: EmployeeUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/employees'

const employee: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  create: data => request.post(PREFIX, data),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetEmployeesQuery = (
  params: EmployeesListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getEmployees', params], employee.get, {
    onError: () => {},
    ...options,
  })

export const useGetEmployeeDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getEmployeeDetail', id], employee.getOne, options)

export const useCreateEmployeeMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createEmployee'], employee.create, options)
}

export const useUpdateEmployeesMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateEmployees'], employee.update, options)
}

export const useDeleteEmployeesMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteEmployees'], employee.delete, options)
}
