import { api } from '../../api/client'
import type { Project, CreateProjectDto, UpdateProjectDto } from './types'

export type { Project }

export const projectKeys = {
  all: ['projects'] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: number) => [...projectKeys.details(), id] as const,
}

export const getProjects = () => api.get<Project[]>('/projects')

export const getProject = (id: number) => api.get<Project>(`/projects/${id}`)

export const createProject = (data: CreateProjectDto) =>
  api.post<Project, CreateProjectDto>('/projects', data)

export const updateProject = (id: number, data: UpdateProjectDto) =>
  api.put<Project, UpdateProjectDto>(`/projects/${id}`, data)

export const deleteProject = (id: number) => api.delete(`/projects/${id}`)
