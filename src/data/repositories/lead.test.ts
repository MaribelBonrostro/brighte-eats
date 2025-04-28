
import { LeadRepository } from './lead';

jest.mock('drizzle-orm', () => ({
  ...jest.requireActual('drizzle-orm'),
  sql: (strings: TemplateStringsArray, ...values: any[]) => ({
    query: strings.join(''),
    as: (alias: string) => ({ alias }),
  }),
}));

jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

jest.mock('drizzle-orm/node-postgres', () => ({
  drizzle: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  })),
}));



describe('LeadRepository', () => {
  let leadRepo: LeadRepository;
  let mockDb: any;

  beforeEach(() => {
    jest.clearAllMocks();
    leadRepo = new LeadRepository();
    mockDb = (leadRepo as any).db;
  });

  describe('getAllLeadsWithServices', () => {
    it('should fetch all leads with their services', async () => {
      const fakeDbResult = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@gmail.com',
          mobile: '09324234342',
          postcode: '2024',
          services: '{delivery,pick_up}',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'janeSmith@gmail.com',
          mobile: '09324234343',
          postcode: '2025',
          services: '{pick_up}',
        },
      ];

      mockDb.execute.mockResolvedValueOnce(fakeDbResult);

      const results = await leadRepo.getAllLeadsWithServices();

      expect(results).toEqual([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@gmail.com',
          mobile: '09324234342',
          postcode: '2024',
          services: ['delivery', 'pick_up'],
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'janeSmith@gmail.com',
          mobile: '09324234343',
          postcode: '2025',
          services: ['pick_up'],
        },
      ]);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
      expect(mockDb.innerJoin).toHaveBeenCalledTimes(2);
      expect(mockDb.groupBy).toHaveBeenCalled();
      expect(mockDb.execute).toHaveBeenCalled();
    });
  });
  describe('getLeadWithServicesById', () => {
    it('should fetch a lead by ID with their services', async () => {
      const fakeDbResult = [
        {
          id: '1',
          name: 'John Doe',
          email: 'johndoe@gmail.com',
          mobile: '09269747000',
          postcode: '3024',
          services: '{delivery}',
        },
      ];
      mockDb.execute.mockResolvedValueOnce(fakeDbResult);
      const result = await leadRepo.getLeadWithServicesById('1');

      expect(result).toEqual({
        id: '1',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        mobile: '09269747000',
        postcode: '3024',
        services: ['delivery'],
      });
    });
  });
});