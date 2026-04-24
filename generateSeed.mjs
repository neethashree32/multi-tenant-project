import fs from "fs";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

async function generateSeed() {
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const orgId = randomUUID();
  const orgName = "NexusFlow Corp";

  const adminIds = [randomUUID(), randomUUID()];
  const memberIds = Array.from({ length: 12 }, () => randomUUID());

  let sql = `
-- ============================================
-- Seeding 15 Demo Accounts & Data
-- ============================================

DO $$ 
DECLARE
  org_id UUID := '${orgId}';
  admin1_id UUID := '${adminIds[0]}';
  admin2_id UUID := '${adminIds[1]}';
BEGIN

-- 1. Insert Organization
IF NOT EXISTS (SELECT 1 FROM organizations WHERE name = '${orgName}') THEN
  INSERT INTO organizations (id, name, description) 
  VALUES (org_id, '${orgName}', 'Lead the flow with NexusFlow Infrastructure.');
ELSE
  SELECT id INTO org_id FROM organizations WHERE name = '${orgName}';
END IF;

-- 2. Insert Organization Owner Account
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('${randomUUID()}', '${orgName} Owner', 'org@nexusflow.com', '${passwordHash}', 'organization', org_id, true)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert 2 Admins
INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active) VALUES
(admin1_id, 'Sarah Admin', 'admin1@nexusflow.com', '${passwordHash}', 'admin', org_id, true),
(admin2_id, 'James Admin', 'admin2@nexusflow.com', '${passwordHash}', 'admin', org_id, true)
ON CONFLICT (email) DO NOTHING;

-- 4. Insert 12 Members
`;

  const memberNames = [
    "Liam Miller", "Noah Davis", "Oliver Garcia", "Elijah Rodriguez",
    "Lucas Wilson", "Mason Anderson", "Logan Taylor", "Ethan Moore",
    "Aiden Jackson", "Hudson White", "Sebastian Kelly", "Jack Brooks"
  ];

  memberNames.forEach((name, i) => {
    sql += `INSERT INTO users (id, name, email, password_hash, role, organization_id, is_active)
VALUES ('${memberIds[i]}', '${name}', 'member${i + 1}@nexusflow.com', '${passwordHash}', 'member', org_id, true)
ON CONFLICT (email) DO NOTHING;\n`;
  });

  sql += `
-- 5. Insert Sample Tasks
INSERT INTO tasks (title, description, status, priority, organization_id, created_by_id, assigned_to_id, due_date) VALUES
('System Infrastructure Audit', 'Perform a full security sweep of the NexusFlow cluster.', 'in_progress', 'high', org_id, admin1_id, '${memberIds[0]}', NOW() + INTERVAL '3 days'),
('UI Localization', 'Translate the dashboard into 5 new languages.', 'todo', 'medium', org_id, admin2_id, '${memberIds[1]}', NOW() + INTERVAL '7 days'),
('Database Migration', 'Optimize the PostgreSQL indexing for multi-tenant scaling.', 'done', 'urgent', org_id, admin1_id, '${memberIds[2]}', NOW() - INTERVAL '1 day'),
('Feature: Real-time Comms', 'Implement WebSocket support for task notifications.', 'todo', 'high', org_id, admin2_id, '${memberIds[3]}', NOW() + INTERVAL '10 days'),
('API Documentation', 'Update Swagger docs with the new multi-tenant endpoints.', 'in_progress', 'low', org_id, admin1_id, '${memberIds[4]}', NOW() + INTERVAL '5 days');

-- 6. Insert Sample Events
INSERT INTO events (title, description, location, status, organization_id, created_by_id, start_date, end_date) VALUES
('Quarterly Strategy Sync', 'Alignment on NexusFlow H2 roadmap.', 'Main Hall A', 'upcoming', org_id, admin1_id, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 4 hours'),
('Team Building Workshop', 'Interactive sessions to boost cross-tenant collaboration.', 'Beachfront Resort', 'upcoming', org_id, admin2_id, NOW() + INTERVAL '15 days', NOW() + INTERVAL '16 days');

-- 7. Insert Sample Feedbacks from Members
INSERT INTO feedbacks (content, category, rating, organization_id, user_id) VALUES
('The new light theme is very clean and faster to use!', 'UI/UX', '🤩', org_id, '${memberIds[0]}'),
('Need more task status filters in the overview.', 'Feature Request', '🙂', org_id, '${memberIds[1]}'),
('Experienced some lag when switching between events.', 'Performance', '😐', org_id, '${memberIds[2]}'),
('The sidebar layout is much more intuitive now.', 'UI/UX', '🤩', org_id, '${memberIds[3]}'),
('Would love to have an automated report generator.', 'Feature Request', '🙂', org_id, '${memberIds[4]}');

END $$;
`;

  fs.appendFileSync('init.sql', sql);
  console.log("Appended 15 accounts and rich sample data to init.sql");
}

generateSeed().catch(console.error);
