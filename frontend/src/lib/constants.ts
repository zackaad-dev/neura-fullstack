export const VIOLET = 'rgb(98, 78, 173)'

export type Page = 'landing' | 'login' | 'register' | 'dashboard' | 'tasks' | 'notes'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export const MOCK_TASKS = [
  {
    id: 1,
    title: 'Set up Testcontainers',
    status: 'DONE',
    dueDate: '2026-03-08',
    projectName: 'API Redesign',
  },
  {
    id: 2,
    title: 'Write auth integration tests',
    status: 'IN_PROGRESS',
    dueDate: '2026-03-12',
    projectName: 'API Redesign',
  },
  {
    id: 3,
    title: 'Global exception handler',
    status: 'TODO',
    dueDate: '2026-03-15',
    projectName: 'API Redesign',
  },
  {
    id: 4,
    title: 'Prototype navigation flow',
    status: 'IN_PROGRESS',
    dueDate: '2026-03-11',
    projectName: 'Mobile App',
  },
  {
    id: 5,
    title: 'Review migration scripts',
    status: 'TODO',
    dueDate: '2026-03-20',
    projectName: 'DB Migration',
  },
  {
    id: 6,
    title: 'Flyway V4 notes migration',
    status: 'DONE',
    dueDate: '2026-03-05',
    projectName: 'DB Migration',
  },
]

export const MOCK_NOTES = [
  {
    id: 1,
    title: 'Auth Architecture Decision',
    content:
      'Chose JWT over sessions for stateless scaling. No refresh tokens for MVP — 24hr expiry acceptable. Revisit post-launch.',
    projectName: 'API Redesign',
    updatedAt: '2026-03-09',
  },
  {
    id: 2,
    title: 'DTO Mapping Strategy',
    content:
      'Manual mapping chosen over MapStruct to keep dependencies minimal and mapping logic explicit and testable.',
    projectName: 'API Redesign',
    updatedAt: '2026-03-07',
  },
  {
    id: 3,
    title: 'UI Font Decision',
    content:
      'Outfit (300/400/600 weights) — clean, modern, readable at small sizes. Pairs well with the violet brand color.',
    projectName: 'Mobile App',
    updatedAt: '2026-03-10',
  },
  {
    id: 4,
    title: 'Schema Review Notes',
    content:
      'All foreign keys have ON DELETE CASCADE. Consider adding indexes on user_id for projects and project_id for tasks/notes.',
    projectName: 'DB Migration',
    updatedAt: '2026-03-06',
  },
]
