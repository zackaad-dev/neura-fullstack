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
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName())
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(WrongLoginCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new WrongLoginCredentialsException();
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .build();
    }

    @Transactional
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            return ForgotPasswordResponse.builder()
                    .message("If an account exists with that email, a password reset link has been sent.")
                    .build();
        }

        User user = userOptional.get();
        if (user.isDemo()) {
            throw new DemoAccountException();
        }

        passwordResetTokenRepository.deleteByUser(user);

        String tokenStr = UUID.randomUUID().toString();
        PasswordResetToken token = PasswordResetToken.builder()
                .token(tokenStr)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .used(false)
                .build();

        passwordResetTokenRepository.save(token);

        return ForgotPasswordResponse.builder()
                .message("If an account exists with that email, a password reset link has been sent.")
                .token(tokenStr)
                .build();
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired password reset token"));

        if (token.isUsed()) {
            throw new InvalidTokenException("Password reset token has already been used");
        }

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Password reset token has expired");
        }

        User user = token.getUser();
        if (user.isDemo()) {
            throw new DemoAccountException();
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }
}