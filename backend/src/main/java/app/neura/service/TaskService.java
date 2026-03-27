package app.neura.service;

import app.neura.dto.task.CreateTaskRequest;
import app.neura.dto.task.TaskResponse;
import app.neura.entity.Project;
import app.neura.entity.Task;
import app.neura.exception.ResourceNotFoundException;
import app.neura.repository.ProjectRepository;
import app.neura.repository.TaskRepository;
import org.springframework.stereotype.Service;
import app.neura.entity.TaskStatus;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    public TaskResponse createTask(CreateTaskRequest request, Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Project not found");
        }

        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status() != null ? request.status() : TaskStatus.TODO);
        task.setProject(project);
        task.setDueDate(request.dueDate());

        Task saved = taskRepository.save(task);
        return toResponse(saved);
    }

    private TaskResponse toResponse(Task task) {
       return new TaskResponse(
               task.getId(),
               task.getProject().getId(),
               task.getTitle(),
               task.getDescription(),
               task.getStatus(),
               task.getDueDate(),
               task.getCreatedAt(),
               task.getUpdatedAt()
       );
    }

}
