package app.neura.repository;

import app.neura.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByProjectId(Long projectId);
    Optional<Task> findByIdAndProjectId(Long id, Long projectId);
}
