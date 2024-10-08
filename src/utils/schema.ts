import { integer, serial, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const UsersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").notNull(),
  age: integer("age").notNull(),
  location: varchar("location").notNull(),
  createdBy: varchar("created_by").notNull(),
});

export const RecordsTable = pgTable("records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => UsersTable.id)
    .notNull(),
  recordName: varchar("record_name").notNull(),
  analysisResult: varchar("analysis_result").notNull(),
  kanbanRecord: varchar("kanban_record").notNull(),
  createdBy: varchar("created_by").notNull(),
});
