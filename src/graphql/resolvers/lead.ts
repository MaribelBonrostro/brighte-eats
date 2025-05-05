import { Context } from '../../types/context';
import { Lead } from './lead.types';
import { isValidEmail } from '../../utils';
import { createGraphQLError } from '../helpers/errorUtil';

export default {
  LeadQueries: {
    async leads(parent: unknown, args: unknown, context: Context) {
      return context.repositories.lead.getAllLeadsWithServices();
    },
    async lead(parent: unknown, args: { id: string }, context: Context) {
      return context.dataloaders.lead.load(args.id);
    },
  },
  Query: {
    lead: () => ({}),
  },

  LeadMutations: {
    async create(parent: unknown, args: { input: Lead }, context: Context) {
      const { name, email, postcode, mobile, services } = args.input;
      if (!isValidEmail(email)) {
        throw createGraphQLError('Invalid email format', 'BAD_USER_INPUT', 400);
      }
      if (!name || !email || !postcode || !mobile) {
        throw createGraphQLError(
          'All fields are required',
          'BAD_USER_INPUT',
          400,
        );
      }
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
