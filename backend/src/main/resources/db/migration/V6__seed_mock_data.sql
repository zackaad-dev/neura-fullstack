-- Insert Demo User
INSERT INTO users (id, email, password_hash, display_name, is_demo, created_at, updated_at)
VALUES (1001, 'demo@neura.dev', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Demo User', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert Mock Project
INSERT INTO projects (id, user_id, name, description, created_at, updated_at)
VALUES (1001, 1001, 'Website Redesign', 'Overhaul the landing page and dashboard', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert Mock Tasks
INSERT INTO tasks (id, project_id, title, description, status, due_date, created_at, updated_at)
VALUES 
    (1001, 1001, 'Setup Vite', 'Initialize the frontend with Vite + React', 'DONE', CURRENT_DATE, NOW(), NOW()),
    (1002, 1001, 'Create mockups', 'Draft Figma designs for the new dashboard', 'IN_PROGRESS', CURRENT_DATE + INTERVAL '2 days', NOW(), NOW()),
    (1003, 1001, 'Migrate API endpoints', 'Point staging environment to the new v2 endpoints', 'TODO', CURRENT_DATE + INTERVAL '5 days', NOW(), NOW())
ON CONFLICT DO NOTHING;