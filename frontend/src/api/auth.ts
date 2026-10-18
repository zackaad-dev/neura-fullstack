import { api } from './client'

export interface AuthResponse {
  displayName: string | null
  token: string
  email: string
}

export interface RegisterRequest {
  email: string
  password: string
  displayName?: string
}

export interface ForgotPasswordResponse {
  message: string
  token?: string
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  return api.post<AuthResponse, RegisterRequest>('/auth/register', payload)
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return api.post<AuthResponse, { email: string; password: string }>('/auth/login', { email, password })
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  return api.post<ForgotPasswordResponse, { email: string }>('/auth/forgot-password', { email })
}

export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  return api.post<{ message: string }, { token: string; newPassword: string }>('/auth/reset-password', { token, newPassword })
}
