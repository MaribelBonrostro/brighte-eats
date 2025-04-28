import { pgTable, uuid, integer } from 'drizzle-orm/pg-core';
import { Leads } from './leads';
import { Services } from './services';

export const LeadServices = pgTable('lead_services', {
  leadId: uuid('lead_id')
    .notNull()
    .references(() => Leads.id),
  serviceId: integer('service_id')
    .notNull()
    .references(() => Services.id),
});
