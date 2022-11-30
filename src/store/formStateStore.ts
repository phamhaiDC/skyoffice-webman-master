import create from 'zustand'

type FormStateStore = {
  isDirty: boolean
  setIsDirty: (_isDirty: boolean) => void
}

export const useFormStateStore = create<FormStateStore>()(set => ({
  isDirty: false,
  setIsDirty: (_isDirty: boolean) => set({ isDirty: _isDirty }),
}))
