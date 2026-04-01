package app.neura.service;

import app.neura.dto.auth.LoginRequest;
import app.neura.dto.auth.RegisterRequest;
import app.neura.dto.auth.AuthResponse;
import app.neura.entity.User;
import app.neura.exception.EmailAlreadyExistsException;
import app.neura.exception.WrongLoginCredentialsException;
import app.neura.repository.UserRepository;
import app.neura.security.JwtUtil;
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
        String email = "test@neura.app";
        String rawPassword = "password123";
        String encodedPassword = "encodedPassword";
        String mockToken = "eyJhbGciOiJIUzI1NiJ9.mocktoken";

        LoginRequest req = new LoginRequest();
        req.setEmail(email);
        req.setPassword(rawPassword);

        User user = User.builder()
                .email(email)
                .passwordHash(encodedPassword)
                .build();
        when(userRepository.findByEmail(email)).thenReturn(java.util.Optional.of(user));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
        when(jwtUtil.generateToken(email)).thenReturn(mockToken);

        AuthResponse response = authService.login(req);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo(mockToken);

        verify(userRepository).findByEmail(email);
        verify(passwordEncoder).matches(rawPassword, encodedPassword);
        verify(jwtUtil).generateToken(email);
    }

    @Test
    void login_withInvalidCredentials_throwsUnauthorized(){
        String email = "test@neura.app";
        String rawPassword = "password123";
        String encodedPassword = "encodedPassword";

        LoginRequest req = new LoginRequest();
        req.setEmail(email);
        req.setPassword(rawPassword);

        User user = User.builder()
                .email(email)
                .passwordHash(encodedPassword)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(java.util.Optional.of(user));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(WrongLoginCredentialsException.class);

        verify(userRepository).findByEmail(email);
        verify(passwordEncoder).matches(rawPassword, encodedPassword);
        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    void login_withUnknownEmail_throwsUnauthorized(){
        String email = "unknown@mail.com";
        LoginRequest req = new LoginRequest();
        req.setEmail(email);
        req.setPassword("password123");

        when(userRepository.findByEmail(email)).thenReturn(java.util.Optional.empty());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(WrongLoginCredentialsException.class);

        verify(userRepository).findByEmail(email);
        verify(passwordEncoder, never()).matches(any(), any());
        verify(jwtUtil, never()).generateToken(any());
    }
}