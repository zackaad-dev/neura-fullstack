package app.neura.dto.note;

import jakarta.validation.constraints.Size;

public record UpdateNoteRequest (
        @Size(min = 1)
        String title,
        String content
) {}