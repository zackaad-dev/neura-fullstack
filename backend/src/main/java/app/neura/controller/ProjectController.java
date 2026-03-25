package app.neura.controller;

import app.neura.dto.project.CreateProjectRequest;
import app.neura.dto.project.ProjectResponse;
import app.neura.dto.project.UpdateProjectRequest;
import app.neura.service.ProjectService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal Long userId
            ){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(request, userId));
    };

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getUserProjects(
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(projectService.getUserProjects(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId
    ){
        return ResponseEntity.ok(projectService.getProject(id, userId));
    };

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request,
            @AuthenticationPrincipal Long userId
    ){
        return ResponseEntity.ok(projectService.updateProject(id, request, userId));
    };

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId
    ){
        projectService.deleteProject(id, userId);
    }
}
