package app.neura.dto.profile;

public record UserResponse(
        Long id,
        String email,
        String displayName,
        boolean demo
)
{}
