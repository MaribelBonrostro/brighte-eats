import { BaseRepository } from './base';
import { Leads } from '../schemas/leads';
import { Pool } from 'pg';
import { LeadServices } from '../schemas/lead_services';
import { Services } from '../schemas/services';
import { eq, inArray, sql } from 'drizzle-orm';
import { Lead } from '../../graphql/resolvers/lead.types';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface LeadWithServices {
  id: string;
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: string[];
}

export class LeadRepository extends BaseRepository<typeof Leads> {
  constructor() {
    super(Leads, pool);
  }

  private getLeadServiceSelect() {
    return {
      id: Leads.id,
      name: Leads.name,
      email: Leads.email,
      mobile: Leads.mobile,
      postcode: Leads.postcode,
      services: sql`ARRAY_AGG(${Services.name})`.as('services'),
    };
  }

  private processServicesField(services: string | null): string[] {
    return services ? services.replace(/[{}]/g, '').split(',') : [];
  }

  async getAllLeadsWithServices(): Promise<LeadWithServices[]> {
    try {
      const result = await this.db
        .select(this.getLeadServiceSelect())
        .from(LeadServices)
        .innerJoin(Leads, eq(LeadServices.leadId, Leads.id))
        .innerJoin(Services, eq(LeadServices.serviceId, Services.id))
        .groupBy(
          Leads.id,
          Leads.name,
          Leads.email,
          Leads.mobile,
          Leads.postcode,
        )
        .execute();

      return result.map((row) => ({
        ...row,
        services: this.processServicesField(row.services as string),
      }));
    } catch (error) {
      console.error('Error fetching lead services:', error);
      throw error;
    }
  }

  async getLeadWithServicesById(
    leadId: string,
  ): Promise<LeadWithServices | null> {
    try {
      const result = await this.db
        .select(this.getLeadServiceSelect())
        .from(LeadServices)
        .innerJoin(Leads, eq(LeadServices.leadId, Leads.id))
        .innerJoin(Services, eq(LeadServices.serviceId, Services.id))
        .where(eq(Leads.id, leadId))
        .groupBy(
          Leads.id,
          Leads.name,
          Leads.email,
          Leads.mobile,
          Leads.postcode,
        )
        .execute();

      if (result.length === 0) {
        return null;
      }

      const lead = result[0];
      return {
        ...lead,
        services: this.processServicesField(lead.services as string),
      };
    } catch (error) {
      console.error(`Error fetching lead service by ID (${leadId}):`, error);
      throw error;
    }
  }

  async createLeadWithServices(data: Lead): Promise<LeadWithServices> {
    try {
      const [newLead] = await this.insert({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        postcode: data.postcode,
      });

      const serviceRecords = await this.db
        .select({
          id: Services.id,
          name: Services.name,
        })
        .from(Services)
        .where(inArray(Services.name, data.services))
        .execute();

      const serviceIds = serviceRecords.map((service) => service.id);

      const leadServices = serviceIds.map((serviceId) => ({
        leadId: newLead.id,
        serviceId,
      }));

      await this.db.insert(LeadServices).values(leadServices).execute();
      return {
        ...newLead,
        services: data.services,
      };
    } catch (error) {
      console.error('Error creating lead with services:', error);
      throw error;
    }
  }
}
