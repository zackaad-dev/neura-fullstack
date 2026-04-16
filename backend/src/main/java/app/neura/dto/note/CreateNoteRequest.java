package app.neura.dto.note;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateNoteRequest(
        @NotBlank(message = "Note must have a title")
        @Size(max = 255, message = "Note title is too long (max 255 characters")
        String title,
        String content
) {}