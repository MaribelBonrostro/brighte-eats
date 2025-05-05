import DataLoader from 'dataloader';
import { LeadRepository } from '../repositories/lead';

export const leadDataLoader = new DataLoader(async (ids: readonly string[]) => {
  const leads = await new LeadRepository().getAllLeadsWithServices();
  const leadMap = new Map(leads.map((lead) => [lead.id, lead]));
  return ids.map((id) => leadMap.get(id) || null);
});
