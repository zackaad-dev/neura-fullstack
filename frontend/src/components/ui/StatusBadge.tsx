type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = {
    TODO: {
      label: 'To Do',
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-400',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
    },
    DONE: {
      label: 'Done',
      bg: 'bg-green-50 dark:bg-green-900/30',
      text: 'text-green-600 dark:text-green-400',
    },
  }[status]

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
