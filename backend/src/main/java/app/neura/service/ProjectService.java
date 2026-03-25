package app.neura.service;

import app.neura.dto.project.CreateProjectRequest;
import app.neura.dto.project.ProjectResponse;
import app.neura.dto.project.UpdateProjectRequest;
import app.neura.entity.Project;
import app.neura.entity.User;
import app.neura.exception.ResourceNotFoundException;
import app.neura.repository.ProjectRepository;
import app.neura.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public ProjectResponse createProject(CreateProjectRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = new Project();
        project.setName(request.name());
        project.setDescription(request.description());
        project.setUser(user);

        Project saved = projectRepository.save(project);
        return toResponse(saved);

    }

    public List<ProjectResponse> getUserProjects(Long userId) {
        return projectRepository.findAllByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ProjectResponse getProject(Long projectId, Long userId) {
        Project project = getOwnedProject(projectId, userId);
        return toResponse(project);
    }

    public ProjectResponse updateProject(Long projectId, UpdateProjectRequest request, Long userId) {
        Project project = getOwnedProject(projectId, userId);

        if (request.name() != null && !request.name().isBlank()) {
            project.setName(request.name());
        }

        if (request.description() != null) {
            project.setDescription(request.description());
        }

        return toResponse(projectRepository.save(project));
    }

    private Project getOwnedProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        if (!project.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Project not found");
        }
        return project;
    }

    public void deleteProject(Long projectId, Long userId) {
        Project project = getOwnedProject(projectId, userId);
        projectRepository.delete(project);
    }

    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getCreatedAt(),
                project.getUpdated_at()
        );
    }

}
