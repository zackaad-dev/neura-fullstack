export interface Project {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export type CreateProjectDto = {
  name: string
  description?: string
}

export type UpdateProjectDto = {
  name?: string
  description?: string
}
