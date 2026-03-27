const fs = require('fs')
const content = fs.readFileSync('src/components/ui/TaskModal.tsx', 'utf8')
fs.writeFileSync('src/components/ui/TaskModal.tsx', content.replace('onSubmit: (data: CreateTaskDto | UpdateTaskDto) => void', 'onSubmit: (payload: CreateTaskDto | UpdateTaskDto) => void').replace('onSubmit: (data: any) => void', 'onSubmit: (payload: any) => void'))
