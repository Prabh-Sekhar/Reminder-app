import { uuid, pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const remindersTable = pgTable("remindersTable", {
    id: uuid().primaryKey(),
    task: text().notNull(),
    time: timestamp().notNull(),
    status: text().notNull().default('Pending'),
    remindCount: integer().notNull().default(0),
    nextRemindTime: timestamp().notNull()
});