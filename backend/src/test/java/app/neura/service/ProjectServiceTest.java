package app.neura.service;
import app.neura.dto.project.CreateProjectRequest;
import app.neura.dto.project.ProjectResponse;
import app.neura.dto.project.UpdateProjectRequest;
import app.neura.entity.Project;
import app.neura.entity.User;
import app.neura.exception.DemoAccountException;
import app.neura.exception.ResourceNotFoundException;
import app.neura.repository.ProjectRepository;
import app.neura.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectService projectService;

    private User testUser;
    private Project testProject;

    @Mock
    private UserService userService;

    @Mock
    CreateProjectRequest request;

    @BeforeEach
    void setUp() {
        lenient().doNothing().when(userService).guardDemoAccount(any());
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("foo@bar.com");

        testProject = new Project();
        testProject.setId(1L);
        testProject.setName("Test Project");
        testProject.setDescription("Test Description");
        testProject.setUser(testUser);
        testProject.setCreatedAt(LocalDateTime.now());
        testProject.setUpdatedAt(LocalDateTime.now());
    }


    @Test
    void createProject_whenUserExists_savesAndReturnsProjectResponse() {
        CreateProjectRequest request = new CreateProjectRequest("Test Project", "Test Description");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        ProjectResponse response = projectService.createProject(request, 1L);

        assertThat(response).isNotNull();
        assertThat(response.name()).isEqualTo("Test Project");
        assertThat(response.description()).isEqualTo("Test Description");
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void createProject_whenUserNotFound_throwsResourceNotFoundException() {
        CreateProjectRequest request = new CreateProjectRequest("Test Project", "Test Description");

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.createProject(request, 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");

        verify(projectRepository, never()).save(any());
    }


    @Test
    void getUserProjects_returnsProjectsForUser() {
        when(projectRepository.findAllByUserId(1L)).thenReturn(List.of(testProject));

        List<ProjectResponse> responses = projectService.getUserProjects(1L);
        assertThat(responses.get(0).name()).isEqualTo("Test Project");
    }

    @Test
    void getUserProjects_whenNoProjects_returnsEmptyList() {
        when(projectRepository.findAllByUserId(1L)).thenReturn(List.of());

        List<ProjectResponse> responses = projectService.getUserProjects(1L);

        assertThat(responses).isEmpty();
    }

    @Test
    void getProject_whenUserOwnsProject_returnsProjectResponse() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        ProjectResponse response = projectService.getProject(1L, 1L);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Test Project");
    }

    @Test
    void getProject_whenProjectNotFound_throwsResourceNotFoundException() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getProject(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Project not found");
    }

    @Test
    void getProject_whenUserDoesNotOwnProject_throwsResourceNotFoundException() {
        User otherUser = new User();
        otherUser.setId(2L);
        testProject.setUser(otherUser);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        assertThatThrownBy(() -> projectService.getProject(1L, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Project not found");
    }

    @Test
    void updateProject_whenUserOwnsProject_updatesAndReturnsResponse() {
        UpdateProjectRequest request = new UpdateProjectRequest("Updated Name", "Updated Description");

        Project updatedProject = new Project();
        updatedProject.setId(1L);
        updatedProject.setName("Updated Name");
        updatedProject.setDescription("Updated Description");
        updatedProject.setUser(testUser);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(projectRepository.save(any(Project.class))).thenReturn(updatedProject);

        ProjectResponse response = projectService.updateProject(1L, request, 1L);

        assertThat(response.name()).isEqualTo("Updated Name");
        assertThat(response.description()).isEqualTo("Updated Description");
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void updateProject_withNullName_doesNotOverwriteName() {
        UpdateProjectRequest request = new UpdateProjectRequest(null, "New Description");

        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        projectService.updateProject(1L, request, 1L);

        assertThat(testProject.getName()).isEqualTo("Test Project");
        verify(projectRepository, times(1)).save(testProject);
    }

    @Test
    void updateProject_withBlankName_doesNotOverwriteName() {
        UpdateProjectRequest request = new UpdateProjectRequest("   ", "New Description");

        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        projectService.updateProject(1L, request, 1L);

        assertThat(testProject.getName()).isEqualTo("Test Project");
    }

    @Test
    void updateProject_whenProjectNotFound_throwsResourceNotFoundException() {
        UpdateProjectRequest request = new UpdateProjectRequest("Updated Name", null);

        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.updateProject(99L, request, 1L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(projectRepository, never()).save(any());
    }

    @Test
    void updateProject_whenUserDoesNotOwnProject_throwsResourceNotFoundException() {
        User otherUser = new User();
        otherUser.setId(2L);
        testProject.setUser(otherUser);

        UpdateProjectRequest request = new UpdateProjectRequest("Updated Name", null);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        assertThatThrownBy(() -> projectService.updateProject(1L, request, 1L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(projectRepository, never()).save(any());
    }

    @Test
    void deleteProject_whenUserOwnsProject_deletesSuccessfully() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        doNothing().when(projectRepository).delete(testProject);

        assertThatCode(() -> projectService.deleteProject(1L, 1L))
                .doesNotThrowAnyException();

        verify(projectRepository, times(1)).delete(testProject);
    }

    @Test
    void deleteProject_whenProjectNotFound_throwsResourceNotFoundException() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.deleteProject(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(projectRepository, never()).delete(any());
    }

    @Test
    void deleteProject_whenUserDoesNotOwnProject_throwsResourceNotFoundException() {
        User otherUser = new User();
        otherUser.setId(2L);
        testProject.setUser(otherUser);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        assertThatThrownBy(() -> projectService.deleteProject(1L, 1L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(projectRepository, never()).delete(any());
    }

    @Test
    void createProject_whenDemoAccount_throwsDemoAccountException() {
        doThrow(new DemoAccountException()).when(userService).guardDemoAccount(1L);
        assertThatThrownBy(() -> projectService.createProject(request, 1L))
                .isInstanceOf(DemoAccountException.class);
    }
}