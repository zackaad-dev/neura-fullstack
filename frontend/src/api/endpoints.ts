export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  health: '/health',
  projects: {
    list: '/projects',
    create: '/projects',
    update: (id: string) => `/projects/${id}`,
    delete: (id: string) => `/projects/${id}`,
  },
  tasks: {
    list: '/tasks',
    create: '/tasks',
    update: (id: string) => `/tasks/${id}`,
    delete: (id: string) => `/tasks/${id}`,
  },
  notes: {
    list: '/notes',
    create: '/notes',
    update: (id: string) => `/notes/${id}`,
    delete: (id: string) => `/notes/${id}`,
  },
}
