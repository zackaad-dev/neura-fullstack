package app.neura.dto.profile;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(min = 1, max = 100) String displayName
) {

}
