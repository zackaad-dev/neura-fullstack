package app.neura.service;

import app.neura.dto.auth.AuthResponse;
import app.neura.dto.auth.ForgotPasswordRequest;
import app.neura.dto.auth.ForgotPasswordResponse;
import app.neura.dto.auth.LoginRequest;
import app.neura.dto.auth.RegisterRequest;
import app.neura.dto.auth.ResetPasswordRequest;
import app.neura.entity.PasswordResetToken;
import app.neura.entity.User;
import app.neura.exception.DemoAccountException;
import app.neura.exception.EmailAlreadyExistsException;
import app.neura.exception.InvalidTokenException;
import app.neura.exception.WrongLoginCredentialsException;
import app.neura.repository.PasswordResetTokenRepository;
import app.neura.repository.UserRepository;
import app.neura.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    UserRepository userRepository;
    @Mock
    PasswordResetTokenRepository passwordResetTokenRepository;
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
        req.setDisplayName("Test User");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        when(jwtUtil.generateToken("test@example.com")).thenReturn("mock-jwt");

        AuthResponse response = authService.register(req);

        assertThat(response.getToken()).isEqualTo("mock-jwt");
        assertThat(response.getEmail()).isEqualTo("test@example.com");
        assertThat(response.getDisplayName()).isEqualTo("Test User");
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
    void login_withValidCredentials_returnsJwt() {
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
                .displayName("Test User")
                .build();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
        when(jwtUtil.generateToken(email)).thenReturn(mockToken);

        AuthResponse response = authService.login(req);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo(mockToken);
        assertThat(response.getEmail()).isEqualTo(email);
        assertThat(response.getDisplayName()).isEqualTo("Test User");

        verify(userRepository).findByEmail(email);
        verify(passwordEncoder).matches(rawPassword, encodedPassword);
        verify(jwtUtil).generateToken(email);
    }

    @Test
    void login_withInvalidCredentials_throwsUnauthorized() {
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

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(WrongLoginCredentialsException.class);

        verify(userRepository).findByEmail(email);
        verify(passwordEncoder).matches(rawPassword, encodedPassword);
        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    void login_withUnknownEmail_throwsUnauthorized() {
        String email = "unknown@mail.com";
        LoginRequest req = new LoginRequest();
        req.setEmail(email);
        req.setPassword("password123");

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(WrongLoginCredentialsException.class);

        verify(userRepository).findByEmail(email);
        verify(passwordEncoder, never()).matches(any(), any());
        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    void forgotPassword_withValidUser_returnsToken() {
        String email = "user@example.com";
        User user = User.builder().id(1L).email(email).demo(false).build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordResetTokenRepository.save(any(PasswordResetToken.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ForgotPasswordResponse response = authService.forgotPassword(new ForgotPasswordRequest(email));

        assertThat(response.getToken()).isNotBlank();
        assertThat(response.getMessage()).contains("password reset link has been sent");
        verify(passwordResetTokenRepository).deleteByUser(user);
        verify(passwordResetTokenRepository).save(any(PasswordResetToken.class));
    }

    @Test
    void forgotPassword_withUnknownUser_returnsGenericMessageWithoutToken() {
        String email = "nonexistent@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        ForgotPasswordResponse response = authService.forgotPassword(new ForgotPasswordRequest(email));

        assertThat(response.getToken()).isNull();
        assertThat(response.getMessage()).contains("password reset link has been sent");
        verify(passwordResetTokenRepository, never()).save(any());
    }

    @Test
    void forgotPassword_withDemoUser_throwsDemoAccountException() {
        String email = "demo@neura.dev";
        User demoUser = User.builder().id(2L).email(email).demo(true).build();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(demoUser));

        assertThatThrownBy(() -> authService.forgotPassword(new ForgotPasswordRequest(email)))
                .isInstanceOf(DemoAccountException.class);

        verify(passwordResetTokenRepository, never()).save(any());
    }

    @Test
    void resetPassword_withValidToken_resetsPassword() {
        String tokenStr = "valid-token-123";
        User user = User.builder().id(1L).email("user@example.com").passwordHash("oldHash").demo(false).build();
        PasswordResetToken token = PasswordResetToken.builder()
                .token(tokenStr)
                .user(user)
                .used(false)
                .expiryDate(LocalDateTime.now().plusMinutes(10))
                .build();

        when(passwordResetTokenRepository.findByToken(tokenStr)).thenReturn(Optional.of(token));
        when(passwordEncoder.encode("newPassword123")).thenReturn("newHash");

        authService.resetPassword(new ResetPasswordRequest(tokenStr, "newPassword123"));

        assertThat(user.getPasswordHash()).isEqualTo("newHash");
        assertThat(token.isUsed()).isTrue();
        verify(userRepository).save(user);
        verify(passwordResetTokenRepository).save(token);
    }

    @Test
    void resetPassword_withExpiredToken_throwsInvalidTokenException() {
        String tokenStr = "expired-token";
        User user = User.builder().id(1L).email("user@example.com").demo(false).build();
        PasswordResetToken token = PasswordResetToken.builder()
                .token(tokenStr)
                .user(user)
                .used(false)
                .expiryDate(LocalDateTime.now().minusMinutes(1))
                .build();

        when(passwordResetTokenRepository.findByToken(tokenStr)).thenReturn(Optional.of(token));

        assertThatThrownBy(() -> authService.resetPassword(new ResetPasswordRequest(tokenStr, "newPassword123")))
                .isInstanceOf(InvalidTokenException.class)
                .hasMessageContaining("expired");

        verify(userRepository, never()).save(any());
    }

    @Test
    void resetPassword_withUsedToken_throwsInvalidTokenException() {
        String tokenStr = "used-token";
        User user = User.builder().id(1L).email("user@example.com").demo(false).build();
        PasswordResetToken token = PasswordResetToken.builder()
                .token(tokenStr)
                .user(user)
                .used(true)
                .expiryDate(LocalDateTime.now().plusMinutes(10))
                .build();

        when(passwordResetTokenRepository.findByToken(tokenStr)).thenReturn(Optional.of(token));

        assertThatThrownBy(() -> authService.resetPassword(new ResetPasswordRequest(tokenStr, "newPassword123")))
                .isInstanceOf(InvalidTokenException.class)
                .hasMessageContaining("already been used");

        verify(userRepository, never()).save(any());
    }

    @Test
    void resetPassword_withDemoUser_throwsDemoAccountException() {
        String tokenStr = "demo-token";
        User demoUser = User.builder().id(2L).email("demo@neura.dev").demo(true).build();
        PasswordResetToken token = PasswordResetToken.builder()
                .token(tokenStr)
                .user(demoUser)
                .used(false)
                .expiryDate(LocalDateTime.now().plusMinutes(10))
                .build();

        when(passwordResetTokenRepository.findByToken(tokenStr)).thenReturn(Optional.of(token));

        assertThatThrownBy(() -> authService.resetPassword(new ResetPasswordRequest(tokenStr, "newPassword123")))
                .isInstanceOf(DemoAccountException.class);

        verify(userRepository, never()).save(any());
    }
}