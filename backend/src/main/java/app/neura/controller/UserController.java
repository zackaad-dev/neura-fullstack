package app.neura.controller;

import app.neura.dto.profile.UpdateProfileRequest;
import app.neura.dto.profile.UserResponse;
import app.neura.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) { this.userService = userService; }

    @GetMapping("/me")
    public UserResponse getProfile(@AuthenticationPrincipal Long userId) {
        return userService.getProfile(userId);
    }

    @PutMapping("/me")
    public UserResponse updateProfile(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody  UpdateProfileRequest request) {
        return userService.updateProfile(userId, request);
    }
}
