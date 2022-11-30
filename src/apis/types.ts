import { QueryKey, UseMutationOptions, UseQueryOptions } from 'react-query'

export type QueryOptions<
  TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TError = unknown,
  TData = TQueryFnData
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  'queryKey' | 'queryFn'
>

export type MutationOptions<
  TData = unknown,
  TVariables = void,
  TError = unknown,
  TContext = unknown
> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationKey' | 'mutationFn'
>
