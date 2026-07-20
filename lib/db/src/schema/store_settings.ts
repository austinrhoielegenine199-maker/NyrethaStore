import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const storeSettingsTable = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  storeName: text("store_name").notNull(),
  description: text("description").notNull(),
  serverIp: text("server_ip").notNull(),
  discordUrl: text("discord_url").notNull(),
  currency: text("currency").notNull().default("USD"),
  logoUrl: text("logo_url"),
});

export const insertStoreSettingsSchema = createInsertSchema(storeSettingsTable).omit({ id: true });
export type InsertStoreSettings = z.infer<typeof insertStoreSettingsSchema>;
export type StoreSettings = typeof storeSettingsTable.$inferSelect;
