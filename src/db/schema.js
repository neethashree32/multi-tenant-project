import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["organization", "admin", "member"]);
export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "done",
  "cancelled",
]);
export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);
export const eventStatusEnum = pgEnum("event_status", [
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
]);
export const auditActionEnum = pgEnum("audit_action", [
  "created",
  "updated",
  "deleted",
  "assigned",
  "status_changed",
  "completed",
]);

// Organizations table
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  name: text("name").notNull(),
  role: roleEnum("role").notNull().default("member"),
  organizationId: uuid("organization_id").references(() => organizations.id, {
    onDelete: "cascade",
  }),
  // Personal details (for members)
  phone: text("phone"),
  address: text("address"),
  department: text("department"),
  position: text("position"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").notNull().default("todo"),
  priority: taskPriorityEnum("priority").notNull().default("medium"),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assignedToId: uuid("assigned_to_id").references(() => users.id, {
    onDelete: "set null",
  }),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Events table
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  status: eventStatusEnum("status").notNull().default("upcoming"),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  maxAttendees: integer("max_attendees"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Event Attendees (join table)
export const eventAttendees = pgTable("event_attendees", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Feedbacks table
export const feedbacks = pgTable("feedbacks", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  rating: text("rating").notNull(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Task Audit Log
export const taskAuditLogs = pgTable("task_audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  action: auditActionEnum("action").notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  fieldChanged: text("field_changed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  tasks: many(tasks),
  events: many(events),
  feedbacks: many(feedbacks),
  taskAuditLogs: many(taskAuditLogs),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  createdTasks: many(tasks, { relationName: "taskCreator" }),
  assignedTasks: many(tasks, { relationName: "taskAssignee" }),
  createdEvents: many(events),
  feedbacks: many(feedbacks),
  eventAttendees: many(eventAttendees),
  auditLogs: many(taskAuditLogs),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [tasks.organizationId],
    references: [organizations.id],
  }),
  createdBy: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
    relationName: "taskCreator",
  }),
  assignedTo: one(users, {
    fields: [tasks.assignedToId],
    references: [users.id],
    relationName: "taskAssignee",
  }),
  auditLogs: many(taskAuditLogs),
}));

export const feedbacksRelations = relations(feedbacks, ({ one }) => ({
  organization: one(organizations, {
    fields: [feedbacks.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [feedbacks.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [events.organizationId],
    references: [organizations.id],
  }),
  createdBy: one(users, {
    fields: [events.createdById],
    references: [users.id],
  }),
  attendees: many(eventAttendees),
}));

export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendees.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventAttendees.userId],
    references: [users.id],
  }),
}));

export const taskAuditLogsRelations = relations(taskAuditLogs, ({ one }) => ({
  task: one(tasks, {
    fields: [taskAuditLogs.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [taskAuditLogs.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [taskAuditLogs.organizationId],
    references: [organizations.id],
  }),
}));
