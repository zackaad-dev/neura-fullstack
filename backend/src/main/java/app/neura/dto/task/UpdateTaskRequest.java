package app.neura.dto.task;

import app.neura.entity.TaskStatus;
import jakarta.validation.constraints.Size;

public record UpdateTaskRequest (
        @Size(min = 1)
        String name,
        String description,
        TaskStatus status
) {}
