package app.neura.controller;

import app.neura.dto.profile.UpdatePasswordRequest;
import app.neura.dto.profile.UpdateProfileRequest;
import app.neura.dto.profile.UserResponse;
import app.neura.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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
            @Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(userId, request);
    }

    @PutMapping("/me/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> updatePassword(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody UpdatePasswordRequest request) {
        userService.updatePassword(userId, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteAccount(
            @AuthenticationPrincipal Long userId) {
        userService.deleteAccount(userId);
        return ResponseEntity.noContent().build();
    }
}
