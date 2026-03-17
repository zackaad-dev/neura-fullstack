package app.neura.service;

import app.neura.dto.auth.LoginRequest;
import app.neura.dto.auth.RegisterRequest;
import app.neura.dto.auth.AuthResponse;
import app.neura.entity.User;
import app.neura.exception.EmailAlreadyExistsException;
import app.neura.repository.UserRepository;
import app.neura.security.JwtUtil;
import app.neura.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    UserRepository userRepository;
    @Mock
    PasswordEncoder passwordEncoder;
    @Mock
    JwtUtil jwtUtil;

    @InjectMocks
    AuthService authService;

    @Test
    void register_withNewEmail_returnsTokenAndEmail() {

        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@example.com");
        req.setPassword("password123");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed");


        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        when(jwtUtil.generateToken("test@example.com")).thenReturn("mock-jwt");


        AuthResponse response = authService.register(req);


        assertThat(response.getToken()).isEqualTo("mock-jwt");
        assertThat(response.getEmail()).isEqualTo("test@example.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_withExistingEmail_throwsEmailAlreadyExistsException() {

        RegisterRequest req = new RegisterRequest();
        req.setEmail("taken@example.com");
        req.setPassword("password123");

        when(userRepository.existsByEmail("taken@example.com")).thenReturn(true);


        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(EmailAlreadyExistsException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    void login_withValidCredentials_returnsJwt(){

    };

    @Test
    void login_withInvalidCredentials_throwsUnauthorized(){};

    @Test
    void login_withUnknownEmail_throwsUnauthorized(){};
}