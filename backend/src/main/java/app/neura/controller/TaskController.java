package app.neura.controller;

import app.neura.dto.task.CreateTaskRequest;
import app.neura.dto.task.TaskResponse;
import app.neura.dto.task.UpdateTaskRequest;
import app.neura.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal Long userId
            ){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(request, projectId, userId));
    }

    @GetMapping("/projects/{projectId}/tasks")
    public List<TaskResponse> getProjectTasks(
            @PathVariable Long projectId,
            @AuthenticationPrincipal Long userId) {
        return taskService.getProjectTasks(projectId, userId);
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponse> getTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal Long userId
    ) {
        return ResponseEntity.ok(taskService.getTask(taskId, userId));
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request,
            @AuthenticationPrincipal Long userId
    ) {
        return ResponseEntity.ok(taskService.updateTask(taskId, request, userId));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal Long userId
    ) {
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.noContent().build();
    }
}
