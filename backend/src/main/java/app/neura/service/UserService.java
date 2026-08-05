package app.neura.service;

import app.neura.dto.profile.UpdatePasswordRequest;
import app.neura.dto.profile.UpdateProfileRequest;
import app.neura.dto.profile.UserResponse;
import app.neura.entity.User;
import app.neura.exception.DemoAccountException;
import app.neura.exception.ResourceNotFoundException;
import app.neura.exception.WrongLoginCredentialsException;
import app.neura.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toResponse(user);
    }

    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        guardDemoAccount(userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (request.displayName() != null) {
            user.setDisplayName(request.displayName());
        }
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public void updatePassword(Long userId, UpdatePasswordRequest request) {
        guardDemoAccount(userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new WrongLoginCredentialsException();
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(Long userId) {
        guardDemoAccount(userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.isDemo()
        );
    }

    public void guardDemoAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isDemo()) {
            throw new DemoAccountException();
        }
    }
}
