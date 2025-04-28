import repositories from '../src/data/repositories';

export async function contextFactory() {
  return {
    repositories,
  };
}
