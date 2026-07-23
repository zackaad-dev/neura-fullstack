package app.neura.service;

import app.neura.dto.profile.UpdateProfileRequest;
import app.neura.dto.profile.UserResponse;
import app.neura.entity.User;
import app.neura.exception.DemoAccountException;
import app.neura.exception.ResourceNotFoundException;
import app.neura.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void getProfile_returnsUserResponse() {
        User user = User.builder()
                .id(1L)
                .email("user@neura.dev")
                .displayName("Test User")
                .demo(false)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserResponse response = userService.getProfile(1L);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.email()).isEqualTo("user@neura.dev");
        assertThat(response.displayName()).isEqualTo("Test User");
        assertThat(response.demo()).isFalse();
    }

    @Test
    void getProfile_whenUserNotFound_throwsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getProfile(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateProfile_forRegularUser_updatesDisplayName() {
        User user = User.builder()
                .id(1L)
                .email("user@neura.dev")
                .displayName("Old Name")
                .demo(false)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        UpdateProfileRequest request = new UpdateProfileRequest("New Name");
        UserResponse response = userService.updateProfile(1L, request);

        assertThat(response.displayName()).isEqualTo("New Name");
        verify(userRepository).save(user);
    }

    @Test
    void updateProfile_forDemoUser_throwsDemoAccountException() {
        User user = User.builder()
                .id(2L)
                .email("demo@neura.dev")
                .displayName("Demo User")
                .demo(true)
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        UpdateProfileRequest request = new UpdateProfileRequest("New Name");

        assertThatThrownBy(() -> userService.updateProfile(2L, request))
                .isInstanceOf(DemoAccountException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    void guardDemoAccount_whenDemoUser_throwsException() {
        User demoUser = User.builder().id(2L).demo(true).build();
        when(userRepository.findById(2L)).thenReturn(Optional.of(demoUser));

        assertThatThrownBy(() -> userService.guardDemoAccount(2L))
                .isInstanceOf(DemoAccountException.class);
    }

    @Test
    void guardDemoAccount_whenRegularUser_doesNotThrow() {
        User regularUser = User.builder().id(1L).demo(false).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(regularUser));

        userService.guardDemoAccount(1L);
    }
}
