import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  verificationToken: text("verification_token"),
  resetToken: text("reset_token"),
  role: text("role").default("wizard"),
  createdAt: text("created_at").default(new Date().toISOString()),
});
