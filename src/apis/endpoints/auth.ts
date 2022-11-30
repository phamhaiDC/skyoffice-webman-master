import { MutationFunction, useMutation } from 'react-query'
import { LoginResponse } from '@models'
import { authRequest } from '../request'
import { MutationOptions } from '../types'

type AuthResponse = {
  login: LoginResponse
}

export type AuthVariables = {
  login: { login: string; password: string }
}

type AuthAPI = {
  login: MutationFunction<AuthResponse['login'], AuthVariables['login']>
}

const auth: AuthAPI = {
  login: data => authRequest.post('login', data),
}

export const useLoginMutation = (
  options?: MutationOptions<AuthResponse['login'], AuthVariables['login']>
) => useMutation(['login'], auth.login, options)
