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
  oauth_provider TEXT,
  oauth_id TEXT,
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
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_events_org ON events(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_task ON task_audit_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON task_audit_logs(organization_id);

-- ============================================
-- Seeding Demo Data (Idempotent)
-- ============================================

DO $$ 
DECLARE
  org_id UUID := '1d57865f-dbef-447f-a26e-457a3e12a17a';
  admin1_id UUID := 'a671fd9f-d638-46eb-a687-94f04c65150a';
  admin2_id UUID := '986af5ce-ef63-459f-94c1-eab49c1a6009';
  member1_id UUID := '6d4779a0-8cfd-46eb-aabe-bc0bb2e606fc';
  member2_id UUID := '2b0f7b3a-a9b2-46ec-8ad9-7393feb159d5';
  member3_id UUID := '99c32c64-44f9-4829-9aac-ada42aec49a4';
  member4_id UUID := 'e670ccdf-4ec7-49bf-8611-a0609fa80282';
  member5_id UUID := '6f8e803a-4786-4252-b35a-e696a9ebf887';
  member6_id UUID := '9a01305e-d41c-410c-8257-2224423740c9';
  member7_id UUID := '4b83df4e-4735-404e-9e68-7df8bf19bf8c';
  
  task1_id UUID := 'be3428da-a741-42e5-8a91-c24cecef66be';
  task2_id UUID := '200f4aa8-57a1-49bb-bd51-93f2ffb06260';
  task3_id UUID := 'cd60a593-c559-481e-8b93-13157fa7850e';
  task4_id UUID := 'e1a788ed-a569-4053-887a-b4a93d0190fd';
  task5_id UUID := '4a3d5c75-d7b8-4d5a-912d-c4fc5d01341a';
  
  event1_id UUID := 'b8f986fd-e8ff-4e0a-a577-d9d3b16c5b9d';
  event2_id UUID := '649ac754-ffd5-4aab-a3f4-1709b37057c6';
BEGIN

-- Insert Organization (1)
IF NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Acme Corp') THEN
  INSERT INTO organizations (id, name, description) 
  VALUES (org_id, 'Acme Corp', 'A highly dynamic and fast-paced startup.');
ELSE
  SELECT id INTO org_id FROM organizations WHERE name = 'Acme Corp';
END IF;

-- Insert Admins (2)
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES 
(admin1_id, 'Alice Admin', 'admin1@acme.com', '$2b$10$fXIjzlC.eskwRT7Eg15B.OpaS6hV8r1eYfLfTndJ4zsLmPN9E.aYe', 'admin', org_id, true),
(admin2_id, 'Bob Boss', 'admin2@acme.com', '$2b$10$fXIjzlC.eskwRT7Eg15B.OpaS6hV8r1eYfLfTndJ4zsLmPN9E.aYe', 'admin', org_id, true)
ON CONFLICT (email) DO NOTHING;

-- Insert Members (7)
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES 
(member1_id, 'Charlie Carter', 'member1@acme.com', '$2b$10$fXIjzlC.eskwRT7Eg15B.OpaS6hV8r1eYfLfTndJ4zsLmPN9E.aYe', 'member', org_id, true),
(member2_id, 'Diana Davidson', 'member2@acme.com', '$2b$10$fXIjzlC.eskwRT7Eg15B.OpaS6hV8r1eYfLfTndJ4zsLmPN9E.aYe', 'member', org_id, true),
(member3_id, 'Ethan Edwards', 'member3@acme.com', '$2b$10$fXIjzlC.eskwRT7Eg15B.OpaS6hV8r1eYfLfTndJ4zsLmPN9E.aYe', 'member', org_id, true),
(member4_id, 'Fiona Foster', 'member4@acme.com', '$2b$10$fXIjzlC.eskwRT7Eg15B.OpaS6hV8r1eYfLfTndJ4zsLmPN9E.aYe', 'member', org_id, true),
(member5_id, 'George Grant', 'member5@acme.com', '$2b$10$fXIjzlC.eskwRT7Eg15B.OpaS6hV8r1eYfLfTndJ4zsLmPN9E.aYe', 'member', org_id, true),
(member6_id, 'Hannah Hughes', 'member6@acme.com', '$2b$10$fXIjzlC.eskwRT7Eg15B.OpaS6hV8r1eYfLfTndJ4zsLmPN9E.aYe', 'member', org_id, true),
(member7_id, 'Ian Irvine', 'member7@acme.com', '$2b$10$fXIjzlC.eskwRT7Eg15B.OpaS6hV8r1eYfLfTndJ4zsLmPN9E.aYe', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;

-- Insert Organization Owner Account (1) mapped to same Org ID
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES 
('ab013436-14f0-4adf-8aa8-e5d20dfc390c', 'Acme Corp', 'org@acme.com', '$2b$10$fXIjzlC.eskwRT7Eg15B.OpaS6hV8r1eYfLfTndJ4zsLmPN9E.aYe', 'organization', org_id, true)
ON CONFLICT (email) DO NOTHING;

-- Insert Demo Tasks
IF NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Deploy v2.0 to Production') THEN
  INSERT INTO tasks (id, title, description, status, priority, organization_id, created_by_id, assigned_to_id, due_date)
  VALUES 
  (task1_id, 'Deploy v2.0 to Production', 'Ensure all staging tests pass before pushing.', 'in_progress', 'high', org_id, admin1_id, member1_id, NOW() + INTERVAL '2 days'),
  (task2_id, 'Design new Landing Page', 'Update the UI to a modern light theme.', 'done', 'medium', org_id, admin2_id, member2_id, NOW() - INTERVAL '1 day'),
  (task3_id, 'Fix Login Middleware Bug', 'Users are being redirected wrongly. Fix auth token cookies.', 'todo', 'urgent', org_id, admin1_id, member3_id, NOW() + INTERVAL '1 day'),
  (task4_id, 'Prepare Q3 Financial Report', 'Gather all analytics data across the multitenant system.', 'todo', 'high', org_id, admin2_id, member4_id, NOW() + INTERVAL '5 days'),
  (task5_id, 'Onboard New Employees', 'Setup equipment and accounts for new hires.', 'in_progress', 'low', org_id, admin1_id, member5_id, NOW() + INTERVAL '7 days');
END IF;

-- Insert Demo Events
IF NOT EXISTS (SELECT 1 FROM events WHERE title = 'Q3 All Hands Meeting') THEN
  INSERT INTO events (id, title, description, location, status, organization_id, created_by_id, start_date, end_date)
  VALUES 
  (event1_id, 'Q3 All Hands Meeting', 'Company wide sync to discuss roadmap and accomplishments.', 'Virtual - Zoom', 'upcoming', org_id, admin1_id, NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 2 hours'),
  (event2_id, 'Team Building Retreat', 'Annual getaway to boost team morale.', 'Lake Tahoe Cabin', 'upcoming', org_id, admin2_id, NOW() + INTERVAL '14 days', NOW() + INTERVAL '16 days');

  -- Add Attendees
  INSERT INTO event_attendees (event_id, user_id)
  VALUES 
  (event1_id, admin1_id), (event1_id, admin2_id), (event1_id, member1_id), (event1_id, member2_id), (event1_id, member3_id), (event1_id, member4_id),
  (event2_id, admin2_id), (event2_id, member5_id), (event2_id, member6_id), (event2_id, member7_id);
END IF;

END $$;
