import { LeadRepository } from '../data/repositories/lead';
import { LeadServiceRepository } from '../data/repositories/leadService';

export type Context = {
  repositories: {
    lead: LeadRepository;
    lead_service: LeadServiceRepository;
  };
};
