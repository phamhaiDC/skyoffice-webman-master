import {
  MutationFunction,
  QueryFunction,
  useMutation,
  useQuery,
} from 'react-query'
import {
  GetMenuItemsResponse,
  ImageObject,
  MenuItem,
  MenuItemCreateInputs,
  MenuItemPicturesListParams,
  MenuItemsListParams,
  MenuItemsUpdateInputs,
} from '@models'
import request from '../../request'
import { MutationOptions, QueryOptions } from '../../types'

type Response = {
  get: GetMenuItemsResponse
  getOne: MenuItem
  create: MenuItem
  update: MenuItem
  getPictures: {
    pictures: ImageObject[]
    total: number
  }
  delete: { deletedIds: number[] }
}

type QueryKeys = {
  get: ['getMenuItems', MenuItemsListParams]
  getOne: ['getMenuItemDetail', number?]
  getPictures: ['getPictures', MenuItemPicturesListParams]
}

type Variables = {
  create: MenuItemCreateInputs
  update: MenuItemsUpdateInputs[]
  delete: number[]
}

type API = {
  get: QueryFunction<Response['get'], QueryKeys['get']>
  getOne: QueryFunction<Response['getOne'], QueryKeys['getOne']>
  getPictures: QueryFunction<Response['getPictures'], QueryKeys['getPictures']>
  create: MutationFunction<Response['create'], Variables['create']>
  update: MutationFunction<Response['update'], Variables['update']>
  delete: MutationFunction<Response['delete'], Variables['delete']>
}

const PREFIX = 'api/menuitems'

const menuitems: API = {
  get: ({ queryKey: [, { status, ...params }] }) =>
    request.get(PREFIX, { params: { ...params, status: status?.join(',') } }),
  getOne: ({ queryKey: [, id] }) => request.get(`${PREFIX}/${id}`),
  getPictures: ({ queryKey: [, { refId, ...params }] }) =>
    request.get(`${PREFIX}/pictures`, {
      params: { ...params, refId },
    }),
  create: body => request.post(PREFIX, { ...body, status: 1 }),
  update: data => request.put(PREFIX, data),
  delete: ids => request.delete(PREFIX, { data: ids }),
}

export const useGetMenuItemsQuery = (
  params: MenuItemsListParams,
  options?: QueryOptions<Response['get'], QueryKeys['get']>
) =>
  useQuery(['getMenuItems', params], menuitems.get, {
    onError: () => {},
    ...options,
  })

export const useGetMenuItemDetailQuery = (
  id?: number,
  options?: QueryOptions<Response['getOne'], QueryKeys['getOne']>
) => useQuery(['getMenuItemDetail', id], menuitems.getOne, options)

export const useCreateMenuItemMutation = (
  options?: MutationOptions<Response['create'], Variables['create']>
) => {
  return useMutation(['createMenuItem'], menuitems.create, options)
}

export const useUpdateMenuItemsMutation = (
  options?: MutationOptions<Response['update'], Variables['update']>
) => {
  return useMutation(['updateMenuItems'], menuitems.update, options)
}

export const useDeleteMenuItemsMutation = (
  options?: MutationOptions<Response['delete'], Variables['delete']>
) => {
  return useMutation(['deleteMenuItems'], menuitems.delete, options)
}
// -----------------
export const useGetMenuItemPictures = (
  params: MenuItemPicturesListParams,
  options?: QueryOptions<Response['getPictures'], QueryKeys['getPictures']>
) =>
  useQuery(['getPictures', params], menuitems.getPictures, {
    onError: () => {},
    ...options,
  })
