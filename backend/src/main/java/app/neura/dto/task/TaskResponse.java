package app.neura.dto.task;

import app.neura.entity.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponse(
       Long id,
       Long projectId,
       String title,
       String description,
       TaskStatus status,
       LocalDate dueDate,
       LocalDateTime createdAt,
       LocalDateTime updatedAt
) {}


