package app.neura.dto.task;

import app.neura.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateTaskRequest (
        @NotBlank(message = "Task must have a title")
        @Size(max = 255, message = "Task title must not exceed 255 characters")
        String title,
        TaskStatus status,
        String description,
        LocalDate dueDate
) {}