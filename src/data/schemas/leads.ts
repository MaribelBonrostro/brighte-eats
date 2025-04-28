import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { InferModel, sql } from 'drizzle-orm';

export const Leads = pgTable('leads', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  mobile: text('mobile').notNull(),
  postcode: text('postcode').notNull(),
});
