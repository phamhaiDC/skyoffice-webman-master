import buildVersion from '../version.json'

const KEYS = {
  BUILD_VERSION: 'buildVersion',
  DYNAMIC_FILTERS: 'dynamicFiltersStore',
  TABLES_STORE: 'tablesStore',
}

export const checkBuildVersion = () => {
  const clientVersion = localStorage.getItem(KEYS.BUILD_VERSION)
  if (!clientVersion || clientVersion !== JSON.stringify(buildVersion)) {
    localStorage.removeItem(KEYS.DYNAMIC_FILTERS)
    localStorage.removeItem(KEYS.TABLES_STORE)
    localStorage.setItem(KEYS.BUILD_VERSION, JSON.stringify(buildVersion))
  }
}
