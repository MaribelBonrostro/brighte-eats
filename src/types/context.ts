import { LeadRepository } from '../data/repositories/lead';

export type Context = {
  repositories: {
    lead: LeadRepository;
  };
};
