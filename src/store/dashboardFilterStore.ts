import moment from 'moment'
import create from 'zustand'
import { persist } from 'zustand/middleware'

type DashboardFilterStore = {
  dateRange: [moment.Moment, moment.Moment]
  setDateRange: (dateRange: [moment.Moment, moment.Moment]) => void
}

export const useDashboardFilterStore = create<DashboardFilterStore>()(
  persist(
    (set, get) => ({
      dateRange: [moment(new Date()), moment(new Date())],
      setDateRange: dateRange =>
        set({
          dateRange,
        }),
    }),
    {
      name: 'dashboardFilterStore',
    }
  )
)
