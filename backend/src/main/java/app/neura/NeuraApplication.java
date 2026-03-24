package app.neura;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class NeuraApplication {

    public static void main(String[] args) {
        SpringApplication.run(NeuraApplication.class, args);
    }

}
