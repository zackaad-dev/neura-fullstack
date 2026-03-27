package app.neura.service;
import app.neura.dto.task.CreateTaskRequest;
import app.neura.dto.task.TaskResponse;
import app.neura.dto.task.UpdateTaskRequest;
import app.neura.entity.Project;
import app.neura.entity.Task;
import app.neura.exception.ResourceNotFoundException;
import app.neura.repository.ProjectRepository;
import app.neura.repository.TaskRepository;
import org.springframework.stereotype.Service;
import app.neura.entity.TaskStatus;

import java.util.List;

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

    public List<TaskResponse> getProjectTasks(Long projectId, Long userId) {
        return taskRepository.findAllByProjectIdAndProjectUserId(projectId, userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TaskResponse> getUserProjectTasks(Long projectId, Long userId) {
        return taskRepository.findAllByProjectIdAndProjectUserId(projectId, userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse getTask(Long taskId, Long userId) {
        Task task = taskRepository.findByIdAndProjectUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        return toResponse(task);
    }

    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request, Long userId) {
        Task task = taskRepository.findByIdAndProjectUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (request.name() != null) {
            task.setTitle(request.name());
        }
        if (request.description() != null) {
            task.setDescription(request.description());
        }
        if (request.status() != null) {
            task.setStatus(request.status());
        }

        Task saved = taskRepository.save(task);
        return toResponse(saved);
    }

    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findByIdAndProjectUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        taskRepository.delete(task);
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
