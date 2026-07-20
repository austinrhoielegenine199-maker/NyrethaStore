import { pgTable, text, serial, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const giftcardsTable = pgTable("giftcards", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  balance: numeric("balance", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  valid: boolean("valid").notNull().default(true),
});

export const insertGiftcardSchema = createInsertSchema(giftcardsTable).omit({ id: true });
export type InsertGiftcard = z.infer<typeof insertGiftcardSchema>;
export type Giftcard = typeof giftcardsTable.$inferSelect;
