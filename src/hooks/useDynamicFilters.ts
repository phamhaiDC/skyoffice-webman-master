import { Path } from 'react-hook-form'
import {
  FilterValue,
  ScreenName,
  useDynamicFiltersStore,
} from '../store/dynamicFilters'

type DynamicFiltersInfo<Model> = {
  values: FilterValue[]
  setValue: (property: Path<Partial<Model>>, value: any, index?: number) => void
}

const useDynamicFilter = <Model>(
  name: ScreenName
): DynamicFiltersInfo<Model> => {
  const storeValues = useDynamicFiltersStore(state => state[name])
  const setStoreValues = useDynamicFiltersStore(state => state.setValues)

  return {
    values: storeValues || [],
    setValue: (path, value, index) => setStoreValues(name, path, value, index),
  }
}

export default useDynamicFilter
