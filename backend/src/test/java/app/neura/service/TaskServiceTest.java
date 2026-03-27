package app.neura.service;

import app.neura.dto.task.CreateTaskRequest;
import app.neura.dto.task.TaskResponse;
import app.neura.dto.task.UpdateTaskRequest;
import app.neura.entity.Project;
import app.neura.entity.Task;
import app.neura.entity.TaskStatus;
import app.neura.entity.User;
import app.neura.repository.ProjectRepository;
import app.neura.repository.TaskRepository;
import static org.assertj.core.api.Assertions.*;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    ProjectRepository projectRepository;

    @Mock
    TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private User testUser;
    private Project testProject;
    private Task testTask;


    @BeforeEach
    void set() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("task@test.com");

        testProject = new Project();
        testProject.setId(1L);
        testProject.setDescription("Test Description");
        testProject.setUser(testUser);
        testProject.setCreatedAt(LocalDateTime.now());
        testProject.setUpdatedAt(LocalDateTime.now());

        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Finish tests");
        testTask.setProject(testProject);
        testTask.setStatus(TaskStatus.TODO);
        testTask.setCreatedAt(LocalDateTime.now());
        testTask.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void createTask_success(){
        CreateTaskRequest request = new CreateTaskRequest("Finish tests", TaskStatus.TODO, "Hello", LocalDate.MAX);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        TaskResponse response = taskService.createTask(request, 1L, testUser.getId());

        assertThat(response).isNotNull();
        assertThat(response.title()).isEqualTo("Finish tests");
        verify(taskRepository, times(1)).save(any(Task.class));

    }
    @Test
    void getTasksByProject_success() {
        when(taskRepository.findAllByProjectId(1L)).thenReturn(List.of(testTask));

        List<TaskResponse> responses = taskService.getProjectTasks(1L, testUser.getId());

        Assertions.assertThat(responses).hasSize(1);
        Assertions.assertThat(responses.get(0).title()).isEqualTo("Finish tests");

    }

    @Test
    void getTaskById_success() {
        when(taskRepository.findByIdAndProjectUserId(1L, testUser.getId())).thenReturn(Optional.of(testTask));

        TaskResponse response = taskService.getTask(1L, testUser.getId());

        Assertions.assertThat(response.title()).isEqualTo("Finish tests");
    }

    @Test
    void updateTask_success() {
        UpdateTaskRequest request = new UpdateTaskRequest("Updated Title", "Updated Description", TaskStatus.IN_PROGRESS);
        when(taskRepository.findByIdAndProjectUserId(1L, testUser.getId())).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        TaskResponse response = taskService.updateTask(1L, request, testUser.getId());

        assertThat(response).isNotNull();
        assertThat(testTask.getTitle()).isEqualTo("Updated Title");
        assertThat(testTask.getDescription()).isEqualTo("Updated Description");
        assertThat(testTask.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
        verify(taskRepository, times(1)).save(testTask);
    }

    @Test
    void deleteTask_success() {
        when(taskRepository.findByIdAndProjectUserId(1L, testUser.getId())).thenReturn(Optional.of(testTask));

        taskService.deleteTask(1L, testUser.getId());

        verify(taskRepository, times(1)).delete(testTask);
    }

    @Test
    void createTask_projectNotFound_throwsResourceNotFoundException() {
        CreateTaskRequest request = new CreateTaskRequest("Finish tests", TaskStatus.TODO, "Hello", LocalDate.MAX);

        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.createTask(request, 99L, testUser.getId()))
                .isInstanceOf(app.neura.exception.ResourceNotFoundException.class)
                .hasMessageContaining("Project not found");
        
        verify(taskRepository, never()).save(any());
    }

    @Test
    void createTask_projectNotOwnedByUser_throwsResourceNotFoundException() {
        CreateTaskRequest request = new CreateTaskRequest("Finish tests", TaskStatus.TODO, "Hello", LocalDate.MAX);
        User otherUser = new User();
        otherUser.setId(2L);
        testProject.setUser(otherUser);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        assertThatThrownBy(() -> taskService.createTask(request, 1L, testUser.getId()))
                .isInstanceOf(app.neura.exception.ResourceNotFoundException.class)
                .hasMessageContaining("Project not found");
        
        verify(taskRepository, never()).save(any());
    }

    @Test
    void getTaskById_taskNotInUsersProject_throwsResourceNotFoundException() {
        when(taskRepository.findByIdAndProjectUserId(1L, testUser.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTask(1L, testUser.getId()))
                .isInstanceOf(app.neura.exception.ResourceNotFoundException.class)
                .hasMessageContaining("Task not found");
    }

    @Test
    void updateTask_taskNotFound_throwsResourceNotFoundException() {
        UpdateTaskRequest request = new UpdateTaskRequest("Updated Title", "Updated Description", TaskStatus.IN_PROGRESS);
        when(taskRepository.findByIdAndProjectUserId(1L, testUser.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTask(1L, request, testUser.getId()))
                .isInstanceOf(app.neura.exception.ResourceNotFoundException.class)
                .hasMessageContaining("Task not found");

        verify(taskRepository, never()).save(any());
    }

    @Test
    void deleteTask_taskNotFound_throwsResourceNotFoundException() {
        when(taskRepository.findByIdAndProjectUserId(1L, testUser.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.deleteTask(1L, testUser.getId()))
                .isInstanceOf(app.neura.exception.ResourceNotFoundException.class)
                .hasMessageContaining("Task not found");

        verify(taskRepository, never()).delete(any());
    }
}
