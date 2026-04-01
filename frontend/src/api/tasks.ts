import { api } from './client'

export interface TaskResponse {
  id: number
  projectId: number
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskDto {
  title: string
  description?: string
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE'
  dueDate?: string
}

export interface UpdateTaskDto {
  title?: string
  description?: string
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE'
  dueDate?: string
}

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (projectId: number) => [...taskKeys.lists(), projectId] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
}

export function getTasks(projectId: number) {
  return api.get<TaskResponse[]>(`/projects/${projectId}/tasks`)
}

export function createTask(projectId: number, data: CreateTaskDto) {
  return api.post<TaskResponse, CreateTaskDto>(`/projects/${projectId}/tasks`, data)
}

export function getTask(id: number) {
  return api.get<TaskResponse>(`/tasks/${id}`)
}

export function updateTask(id: number, data: UpdateTaskDto) {
  return api.put<TaskResponse, UpdateTaskDto>(`/tasks/${id}`, data)
}

export function deleteTask(id: number) {
  return api.delete<void>(`/tasks/${id}`)
}
