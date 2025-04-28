import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const Services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
});
