import { api } from './client'

export interface NoteResponse {
  id: number
  projectId: number
  title: string
  content: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateNoteRequest {
  title: string
  content?: string
}

export interface UpdateNoteRequest {
  title?: string
  content?: string
}

export function getNotes(projectId: number): Promise<NoteResponse[]> {
  return api.get<NoteResponse[]>(`/projects/${projectId}/notes`)
}

export function createNote(projectId: number, data: CreateNoteRequest): Promise<NoteResponse> {
  return api.post<NoteResponse, CreateNoteRequest>(`/projects/${projectId}/notes`, data)
}

export function updateNote(id: number, data: UpdateNoteRequest): Promise<NoteResponse> {
  return api.put<NoteResponse, UpdateNoteRequest>(`/notes/${id}`, data)
}

export function deleteNote(id: number): Promise<void> {
  return api.delete<void>(`/notes/${id}`)
}
