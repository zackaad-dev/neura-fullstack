import { api } from './client'

export interface NoteResponse {
  id: number
  projectId: number
  title: string
  content: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateNoteDto {
  title: string
  content?: string
}

export interface UpdateNoteDto {
  title?: string
  content?: string
}

export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  list: (projectId: number) => ['notes', projectId] as const, // As specified in custom prompt ['notes', projectId]
  details: () => [...noteKeys.all, 'detail'] as const,
  detail: (id: number) => [...noteKeys.details(), id] as const,
}

export function getNotes(projectId: number) {
  return api.get<NoteResponse[]>(`/projects/${projectId}/notes`)
}

export function createNote(projectId: number, data: CreateNoteDto) {
  return api.post<NoteResponse, CreateNoteDto>(`/projects/${projectId}/notes`, data)
}

export function getNote(id: number) {
  return api.get<NoteResponse>(`/notes/${id}`)
}

export function updateNote(id: number, data: UpdateNoteDto) {
  return api.put<NoteResponse, UpdateNoteDto>(`/notes/${id}`, data)
}

export function deleteNote(id: number) {
  return api.delete<void>(`/notes/${id}`)
}
