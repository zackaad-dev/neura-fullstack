package app.neura.dto.project;

public record UpdateProjectRequest(
        String name,
        String description
) {}