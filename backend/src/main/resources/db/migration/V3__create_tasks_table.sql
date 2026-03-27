CREATE TABLE tasks (
                       id         BIGSERIAL PRIMARY KEY,
                       project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                       title      VARCHAR(255) NOT NULL,
                       description TEXT,
                       status     VARCHAR(20) NOT NULL DEFAULT 'TODO',
                       due_date   DATE,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);