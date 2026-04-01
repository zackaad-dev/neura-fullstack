import { api } from './client'

export type HealthResponse = {
  status: 'UP' | 'DOWN'
}

export const healthApi = {
  get: () => api.get<HealthResponse>('/actuator/health'),
}