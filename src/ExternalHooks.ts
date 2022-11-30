import { NavigateFunction, useNavigate } from 'react-router-dom'
import { AuthStore, useAuthStore } from './store'

const Hooks: {
  navigate?: NavigateFunction
  authStore?: AuthStore
} = {}

export default Hooks

export const HooksSetter = () => {
  Hooks.navigate = useNavigate()
  Hooks.authStore = useAuthStore()

  return null
}
