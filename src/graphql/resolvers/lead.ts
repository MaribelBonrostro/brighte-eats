import { Context } from '../../types/context';
import { Lead } from './lead.types';

export default {
  LeadQueries: {
    async leads(parent: unknown, args: unknown, context: Context) {
      return context.repositories.lead.getAllLeadsWithServices();
    },
    async lead(parent: unknown, args: { id: string }, context: Context) {
      return context.repositories.lead.getLeadWithServicesById(args.id);
    },
  },
  Query: {
    lead: () => ({}),
  },

  LeadMutations: {
    async create(parent: unknown, args: { input: Lead }, context: Context) {
      const { name, email, postcode, mobile, services } = args.input;
      return context.repositories.lead.createLeadWithServices({
        name,
        email,
        postcode,
        mobile,
        services,
      });
    },
  },

  Mutation: {
    lead: () => ({}),
  },
};
