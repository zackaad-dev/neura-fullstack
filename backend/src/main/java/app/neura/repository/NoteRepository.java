package app.neura.repository;

import app.neura.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findAllByProjectId(Long projectId);
    Optional<Note> findByIdAndProjectUserId(Long noteId, Long userId);
}
