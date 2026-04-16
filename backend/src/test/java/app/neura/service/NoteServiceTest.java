package app.neura.service;

import app.neura.dto.note.CreateNoteRequest;
import app.neura.dto.note.UpdateNoteRequest;
import app.neura.entity.Note;
import app.neura.entity.Project;
import app.neura.entity.User;
import app.neura.exception.ResourceNotFoundException;
import app.neura.repository.NoteRepository;
import app.neura.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class NoteServiceTest {
    @Mock
    private NoteRepository noteRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private UserService userService;
    @InjectMocks
    private NoteService noteService;


    private User owner;
    private Project project;
    private Note note;

    @BeforeEach
    void setUp() {
        lenient().doNothing().when(userService).guardDemoAccount(any());

        owner = new User();
        owner.setId(1l);

        project = new Project();
        project.setId(10L);
        project.setUser(owner);

        note = new Note();
        note.setId(100L);
        note.setProject(project);
        note.setTitle("Meeting notes");
        note.setContent("Discussion about finance");
    }

    @Test
    void createNote_success() {
        var request = new CreateNoteRequest("Meeting notes", "Discussed roadmap");
        when(projectRepository.findById(10L)).thenReturn(Optional.of(project));
        when(noteRepository.save(any(Note.class))).thenReturn(note);

        var response = noteService.createNote(10L, request, 1L);

        assertThat(response.title()).isEqualTo("Meeting notes");
        verify(noteRepository).save(any(Note.class));
    }

    @Test
    void createNote_projectNotFound_throws() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class,
                () -> noteService.createNote(99L, new CreateNoteRequest("t", "c"), 1L));
    }

    @Test
    void createNote_projectNotOwnedByUser_throws() {
        when(projectRepository.findById(10L)).thenReturn(Optional.of(project));
        assertThrows(ResourceNotFoundException.class,
                () -> noteService.createNote(10L, new CreateNoteRequest("t", "c"), 999L));
    }


    @Test
    void listNotes_returnsOnlyProjectNotes() {
        when(projectRepository.findById(10L)).thenReturn(Optional.of(project));
        when(noteRepository.findAllByProjectId(10L)).thenReturn(List.of(note));

        var result = noteService.listNotes(10L, 1L);

        //assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("Meeting notes");
    }


    @Test
    void getNote_success() {
        when(noteRepository.findById(100L)).thenReturn(Optional.of(note));

        var response = noteService.getNote(100L, 1L);

        assertThat(response.id()).isEqualTo(100L);
    }

    @Test
    void getNote_notOwner_throws() {
        when(noteRepository.findById(100L)).thenReturn(Optional.of(note));
        assertThrows(ResourceNotFoundException.class,
                () -> noteService.getNote(100L, 999L));
    }


    @Test
    void updateNote_partialUpdate_titleOnly() {
        var request = new UpdateNoteRequest("New title", null);
        when(noteRepository.findById(100L)).thenReturn(Optional.of(note));
        when(noteRepository.save(any(Note.class))).thenReturn(note);

        noteService.updateNote(100L, request, 1L);

        verify(noteRepository).save(argThat(n -> n.getTitle().equals("New title")));
    }

    @Test
    void updateNote_notOwner_throws() {
        when(noteRepository.findById(100L)).thenReturn(Optional.of(note));
        assertThrows(ResourceNotFoundException.class,
                () -> noteService.updateNote(100L, new UpdateNoteRequest("t", "c"), 999L));
    }

    @Test
    void deleteNote_success() {
        when(noteRepository.findById(100L)).thenReturn(Optional.of(note));

        noteService.deleteNote(100L, 1L);

        verify(noteRepository).delete(note);
    }

    @Test
    void deleteNote_notOwner_throws() {
        when(noteRepository.findById(100L)).thenReturn(Optional.of(note));
        assertThrows(ResourceNotFoundException.class,
                () -> noteService.deleteNote(100L, 999L));
    }
}
