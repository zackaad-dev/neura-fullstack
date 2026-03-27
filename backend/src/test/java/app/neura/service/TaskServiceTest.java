package app.neura.service;

import app.neura.dto.task.CreateTaskRequest;
import app.neura.dto.task.TaskResponse;
import app.neura.entity.Project;
import app.neura.entity.Task;
import app.neura.entity.TaskStatus;
import app.neura.entity.User;
import app.neura.repository.ProjectRepository;
import app.neura.repository.TaskRepository;
import app.neura.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;
import org.testcontainers.shaded.org.checkerframework.checker.units.qual.C;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;
import static org.postgresql.hostchooser.HostRequirement.any;

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
    /*getTasksByProject_success()
    getTaskById_success()
    updateTask_success()
    deleteTask_success()




    createTask_projectNotFound_throwsResourceNotFoundException()
    createTask_projectNotOwnedByUser_throwsResourceNotFoundException()
    getTaskById_taskNotInUsersProject_throwsResourceNotFoundException()
    updateTask_taskNotFound_throwsResourceNotFoundException()
    deleteTask_taskNotFound_throwsResourceNotFoundException()*/
}
