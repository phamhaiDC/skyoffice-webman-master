import { LoginResponse } from 'models'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { setOrgId, setTokens, setTokensInSessionStorage } from '@utils/storage'
// import { AuthVariables } from '../apis'

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}

export type AuthVariables = {
  login: { login: string; password: string }
}

export type User = { username: string; role: UserRoles; name: string }

export type AuthStore = {
  user?: User
  keepMeSignedIn?: boolean
  loginResponse?: LoginResponse
  loading: boolean
  login: (data: LoginResponse & AuthVariables['login']) => void
  logout: () => void
  setKeepMeSignedIn: (value: boolean) => void // new
  orgId?: number
  setOrg: (_orgId: number | undefined) => void
}
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      loading: false,

      setKeepMeSignedIn: (value: boolean) => {
        set({ keepMeSignedIn: value })
      },
      setOrg: _orgId => {
        setOrgId(_orgId)
        set({ orgId: _orgId })
      },

      login: data => {
        const { token, organizations, login, name } = data
        const { keepMeSignedIn } = get()
        if (keepMeSignedIn) {
          setTokens(token)
        } else {
          setTokensInSessionStorage(token)
        }
        set({
          loginResponse: data,
          user: { username: login, role: UserRoles.ADMIN, name },
        })
        if (organizations.length === 1) {
          get().setOrg(organizations[0].id)
        } else {
          get().setOrg(undefined)
        }
      },

      logout: () => {
        set({ user: undefined })
        set({ keepMeSignedIn: false })
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
      },
    }),
    { name: 'authStore' }
  )
)
