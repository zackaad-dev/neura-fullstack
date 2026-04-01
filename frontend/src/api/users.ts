import { api } from './client'

export interface UserResponse {
  id: number
  email: string
  displayName: string | null
  demo: boolean
}

export const usersApi = {
  getMe: () => api.get<UserResponse>('/users/me'),
  updateMe: (data: { displayName?: string }) =>
    api.put<UserResponse, { displayName?: string }>('/users/me', data),
}

