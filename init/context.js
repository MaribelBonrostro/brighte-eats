import dataloaders from '../src/data/dataloaders';
import repositories from '../src/data/repositories';

export async function contextFactory() {
  return {
    repositories,
    dataloaders,
  };
}
