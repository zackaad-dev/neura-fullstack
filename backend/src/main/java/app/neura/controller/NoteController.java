package app.neura.controller;

import app.neura.dto.note.CreateNoteRequest;
import app.neura.dto.note.NoteResponse;
import app.neura.dto.note.UpdateNoteRequest;
import app.neura.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {this.noteService = noteService;}

    @PostMapping("/projects/{projectId}/notes")
    public ResponseEntity<NoteResponse> create(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateNoteRequest request,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.status(201).body(noteService.createNote(projectId, request, userId));
    }

    @GetMapping("/projects/{projectId}/notes")
    public List<NoteResponse> list(
            @PathVariable Long projectId,
            @AuthenticationPrincipal Long userId) {
        return noteService.listNotes(projectId, userId);
    }

    @GetMapping("/notes/{id}")
    public NoteResponse get(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        return noteService.getNote(id, userId);
    }

    @PutMapping("/notes/{id}")
    public NoteResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateNoteRequest request,
            @AuthenticationPrincipal Long userId) {
        return noteService.updateNote(id, request, userId);
    }

    @DeleteMapping("/notes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        noteService.deleteNote(id, userId);
    }
}