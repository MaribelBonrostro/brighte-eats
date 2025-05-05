import DataLoader from 'dataloader';
import { LeadRepository } from '../data/repositories/lead';
import { leadDataLoader } from '../data/dataloaders/lead';

export type Context = {
  repositories: {
    lead: LeadRepository;
  };
  dataloaders: {
    lead: DataLoader<any, typeof leadDataLoader>;
  };
};
