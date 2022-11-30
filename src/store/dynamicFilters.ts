import produce from 'immer'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export type ScreenName = 'filter'

export type FilterValue = {
  property: any
  value: any
}

type DynamicFiltersState = {
  [key in ScreenName]: FilterValue[]
} & {
  setValues: (
    name: ScreenName,
    property: any,
    value: any,
    index?: number
  ) => void
}

export const useDynamicFiltersStore = create<DynamicFiltersState>()(
  persist(
    (set, get) => ({
      filter: [
        {
          property: 'dateRange',
          value: [new Date(new Date().setDate(1)), new Date()],
        },
      ],
      setValues: (name, property, value, index) =>
        set(
          produce(store => {
            if (!store[name]) store[name] = []
            if (index === undefined) {
              store[name].push({
                property,
                value,
              })
            } else if (value) {
              store[name][index] = {
                property,
                value,
              }
            } else {
              store[name].splice(index, 1)
            }
          })
        ),
    }),
    {
      name: 'dynamicFiltersStore',
    }
  )
)
