package app.neura.dto.task;

import app.neura.entity.TaskStatus;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateTaskRequest (
        @Size(min = 1, max = 255, message = "Task title must be between 1 and 255 characters")
        String title,
        String description,
        TaskStatus status,
        LocalDate dueDate
) {}
