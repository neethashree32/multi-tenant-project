-- Create enum types
DO $$ BEGIN
  CREATE TYPE role AS ENUM ('organization', 'admin', 'member');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE audit_action AS ENUM ('created', 'updated', 'deleted', 'assigned', 'status_changed', 'completed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  name TEXT NOT NULL,
  role role NOT NULL DEFAULT 'member',
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  phone TEXT,
  address TEXT,
  department TEXT,
  position TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  status event_status NOT NULL DEFAULT 'upcoming',
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  max_attendees INTEGER,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Event Attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  rating TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Task Audit Logs table
CREATE TABLE IF NOT EXISTS task_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  action audit_action NOT NULL,
  old_value TEXT,
  new_value TEXT,
  field_changed TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tasks_org ON tasks(organization_id);
CREATE INDEX IF NOT EXISTS idx_events_org ON events(organization_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_org ON feedbacks(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_task ON task_audit_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON task_audit_logs(organization_id);

-- ============================================
-- Seeding 15 Demo Accounts & Data
-- ============================================

DO $$ 
DECLARE
  org_id UUID := '4633c146-d87f-430f-8cad-0c6e8e62f8fb';
  admin1_id UUID := '8e462394-d694-4226-ad71-ee6662bea8db';
  admin2_id UUID := 'bb9b0875-41c5-4411-9a6e-7e1a6c6f4fea';
BEGIN

-- 1. Insert Organization
IF NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'NexusFlow Corp') THEN
  INSERT INTO organizations (id, name, description) 
  VALUES (org_id, 'NexusFlow Corp', 'Lead the flow with NexusFlow Infrastructure.');
ELSE
  SELECT id INTO org_id FROM organizations WHERE name = 'NexusFlow Corp';
END IF;

-- 2. Insert Organization Owner Account
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('d17e4fd8-8573-4763-9567-d211d1c28c35', 'NexusFlow Corp Owner', 'org@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'organization', org_id, true)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert 2 Admins
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active) VALUES
(admin1_id, 'Sarah Admin', 'admin1@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'admin', org_id, true),
(admin2_id, 'James Admin', 'admin2@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'admin', org_id, true)
ON CONFLICT (email) DO NOTHING;

-- 4. Insert 12 Members
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('4f0b0acc-6700-4bf2-8762-33e488e2f37c', 'Liam Miller', 'member1@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('3c445aa2-b0e2-42f2-bef4-744cc00437cc', 'Noah Davis', 'member2@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('e96f699b-31b7-4b57-9dab-d7cacd90b8b0', 'Oliver Garcia', 'member3@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('716e8b05-73b3-4648-93f4-90e506ac1641', 'Elijah Rodriguez', 'member4@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('dfa37d3d-5cfc-48ef-bea8-c6cdc296ddcb', 'Lucas Wilson', 'member5@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('547e230d-9cbb-49b0-b580-fdc4f10ee126', 'Mason Anderson', 'member6@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('11200896-6d8e-47ee-9e97-463091abdbb2', 'Logan Taylor', 'member7@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('7f50e38f-8b38-4980-9a1c-37d846d4fe99', 'Ethan Moore', 'member8@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('c038e7c7-d30e-4814-a9f8-47218bd62500', 'Aiden Jackson', 'member9@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('869e0734-b67c-4067-9da2-0e27f4131c69', 'Hudson White', 'member10@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('3924ef1c-2523-4b32-a758-c1f3c799266b', 'Sebastian Kelly', 'member11@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('81d98353-eb83-4618-9763-a908aaa7cf7a', 'Jack Brooks', 'member12@nexusflow.com', '$2b$10$D5J5.b7aDwRn0MbHnqF4ee9zCuO4C/Pp.CcZHHThUrKlOMnHZOwY.', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;

-- 5. Insert Sample Tasks
INSERT INTO tasks (title, description, status, priority, organization_id, created_by_id, assigned_to_id, due_date) VALUES
('System Infrastructure Audit', 'Perform a full security sweep of the NexusFlow cluster.', 'in_progress', 'high', org_id, admin1_id, '4f0b0acc-6700-4bf2-8762-33e488e2f37c', NOW() + INTERVAL '3 days'),
('UI Localization', 'Translate the dashboard into 5 new languages.', 'todo', 'medium', org_id, admin2_id, '3c445aa2-b0e2-42f2-bef4-744cc00437cc', NOW() + INTERVAL '7 days'),
('Database Migration', 'Optimize the PostgreSQL indexing for multi-tenant scaling.', 'done', 'urgent', org_id, admin1_id, 'e96f699b-31b7-4b57-9dab-d7cacd90b8b0', NOW() - INTERVAL '1 day'),
('Feature: Real-time Comms', 'Implement WebSocket support for task notifications.', 'todo', 'high', org_id, admin2_id, '716e8b05-73b3-4648-93f4-90e506ac1641', NOW() + INTERVAL '10 days'),
('API Documentation', 'Update Swagger docs with the new multi-tenant endpoints.', 'in_progress', 'low', org_id, admin1_id, 'dfa37d3d-5cfc-48ef-bea8-c6cdc296ddcb', NOW() + INTERVAL '5 days');

-- 6. Insert Sample Events
INSERT INTO events (title, description, location, status, organization_id, created_by_id, start_date, end_date) VALUES
('Quarterly Strategy Sync', 'Alignment on NexusFlow H2 roadmap.', 'Main Hall A', 'upcoming', org_id, admin1_id, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 4 hours'),
('Team Building Workshop', 'Interactive sessions to boost cross-tenant collaboration.', 'Beachfront Resort', 'upcoming', org_id, admin2_id, NOW() + INTERVAL '15 days', NOW() + INTERVAL '16 days');

-- 7. Insert Sample Feedbacks from Members
INSERT INTO feedbacks (content, category, rating, organization_id, user_id) VALUES
('The new light theme is very clean and faster to use!', 'UI/UX', '🤩', org_id, '4f0b0acc-6700-4bf2-8762-33e488e2f37c'),
('Need more task status filters in the overview.', 'Feature Request', '🙂', org_id, '3c445aa2-b0e2-42f2-bef4-744cc00437cc'),
('Experienced some lag when switching between events.', 'Performance', '😐', org_id, 'e96f699b-31b7-4b57-9dab-d7cacd90b8b0'),
('The sidebar layout is much more intuitive now.', 'UI/UX', '🤩', org_id, '716e8b05-73b3-4648-93f4-90e506ac1641'),
('Would love to have an automated report generator.', 'Feature Request', '🙂', org_id, 'dfa37d3d-5cfc-48ef-bea8-c6cdc296ddcb');

END $$;
