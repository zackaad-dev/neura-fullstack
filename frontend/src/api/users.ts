import { api } from './client'

export interface UserResponse {
  id: number
  email: string
  displayName: string | null
  demo: boolean
}

export interface UpdatePasswordDto {
  currentPassword: string
  newPassword: string
}

export const usersApi = {
  getMe: () => api.get<UserResponse>('/users/me'),
  updateMe: (data: { displayName?: string }) =>
    api.put<UserResponse, { displayName?: string }>('/users/me', data),
  updatePassword: (data: UpdatePasswordDto) =>
    api.put<void, UpdatePasswordDto>('/users/me/password', data),
  deleteAccount: () => api.delete<void>('/users/me'),
}
