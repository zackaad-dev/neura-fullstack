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

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  return api.post<AuthResponse, RegisterRequest>('/auth/register', payload)
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return api.post<AuthResponse, {email: string; password: string}>('/auth/login', { email, password })
}
