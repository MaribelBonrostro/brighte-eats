CREATE TABLE "leads" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "mobile" text NOT NULL,
  "postcode" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "leads_email_unique" UNIQUE("email")
);

 --service name enum
CREATE TYPE service_name AS ENUM ('pick_up', 'payment', 'delivery');


CREATE TABLE "services" (
  "id" SERIAL PRIMARY KEY,
  "name" service_name NOT NULL
);

 --lead_services
CREATE TABLE "lead_services" (
  "lead_id" uuid NOT NULL,
  "service_id" integer NOT NULL,
CONSTRAINT "lead_services_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT "lead_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

