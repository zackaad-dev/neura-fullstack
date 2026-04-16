-- V5__create_notes_table.sql
CREATE TABLE notes (
                       id          BIGSERIAL PRIMARY KEY,
                       project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                       title       VARCHAR(255) NOT NULL,
                       content     TEXT,
                       created_at  TIMESTAMP NOT NULL,
                       updated_at  TIMESTAMP NOT NULL
);

CREATE INDEX idx_notes_project_id ON notes(project_id);