package app.neura.service;

import app.neura.dto.note.CreateNoteRequest;
import app.neura.dto.note.NoteResponse;
import app.neura.dto.note.UpdateNoteRequest;
import app.neura.entity.Note;
import app.neura.entity.Project;
import app.neura.exception.ResourceNotFoundException;
import app.neura.repository.NoteRepository;
import app.neura.repository.ProjectRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class NoteService {
    private final NoteRepository noteRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;

    public NoteService(UserService userService, NoteRepository noteRepository, ProjectRepository projectRepository) {
        this.noteRepository = noteRepository;
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    private Project getOwnedProject(Long projectId, Long userId){
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        if (!project.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("An error has occured");
        }
        return project;
    }


    public NoteResponse createNote(Long projectId, CreateNoteRequest request, Long userId) {
        userService.guardDemoAccount(userId);
        Project project = getOwnedProject(projectId, userId);
        Note note = new Note();
        note.setProject(project);
        note.setTitle(request.title());
        note.setContent(request.content());
        return toResponse(noteRepository.save(note));

    }

    public List<NoteResponse> listNotes(Long projectId, Long userId) {
        getOwnedProject(projectId, userId);
        return noteRepository.findAllByProjectId(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    public NoteResponse getNote(Long noteId, Long userId) {
        Note note = noteRepository.findByIdAndProjectUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        return toResponse(note);

    }

    public NoteResponse updateNote(Long noteId, UpdateNoteRequest request, Long userId) {
        userService.guardDemoAccount(userId);
        Note note = noteRepository.findByIdAndProjectUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        if (request.title() != null) {
            note.setTitle(request.title());
        }
        if (request.content() != null) {
            note.setContent(request.content());
        }

        Note saved = noteRepository.save(note);
        return toResponse(saved);
    }

    public void deleteNote(Long noteId, Long userId) {
        userService.guardDemoAccount(userId);
        Note note = noteRepository.findByIdAndProjectUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        noteRepository.delete(note);
    }

    private NoteResponse toResponse(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getProject().getId(),
                note.getTitle(),
                note.getContent(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
}
