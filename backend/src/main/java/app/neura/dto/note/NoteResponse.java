package app.neura.dto.note;

import java.time.LocalDateTime;

public record NoteResponse(
   Long id,
   Long projectId,
   String title,
   String content,
   LocalDateTime createdAt,
   LocalDateTime updatedAt
) {}