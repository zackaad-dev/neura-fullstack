package app.neura.service;

import app.neura.dto.auth.RegisterRequest;
import app.neura.dto.auth.AuthResponse;
import app.neura.entity.User;
import app.neura.exception.EmailAlreadyExistsException;
import app.neura.repository.UserRepository;
import app.neura.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor // Lombok: generates constructor for all final fields (cleaner than @Autowired)
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public app.neura.dto.response.AuthResponse register(app.neura.dto.requests.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token()
    }

}