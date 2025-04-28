import { Service } from '../../graphql/resolvers/lead.types';
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
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
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
        services: [Service.Delivery],
      });
    });
  });
  describe('createLeadWithServices', () => {
    it('should create a lead and link services', async () => {
      const fakeLead = {
        name: 'John Doe',
        email: 'john@example.com',
        postcode: '12345',
        mobile: '0412345678',
        services: [Service.Delivery, Service.PickUp],
      };

      const insertedLead = [
        {
          id: 'lead-id-1',
          name: fakeLead.name,
          email: fakeLead.email,
          mobile: fakeLead.mobile,
          postcode: fakeLead.postcode,
        },
      ];

      const serviceRecords = [
        { id: 'service-id-1', name: Service.Delivery },
        { id: 'service-id-2', name: Service.PickUp },
      ];

      jest.spyOn(leadRepo, 'insert').mockResolvedValueOnce(insertedLead);

      mockDb.execute
        .mockResolvedValueOnce(serviceRecords)
        .mockResolvedValueOnce([]);

      const result = await leadRepo.createLeadWithServices(fakeLead);

      expect(result).toEqual({
        id: 'lead-id-1',
        name: fakeLead.name,
        email: fakeLead.email,
        mobile: fakeLead.mobile,
        postcode: fakeLead.postcode,
        services: [Service.Delivery, Service.PickUp],
      });

      expect(leadRepo.insert).toHaveBeenCalledWith({
        name: fakeLead.name,
        email: fakeLead.email,
        mobile: fakeLead.mobile,
        postcode: fakeLead.postcode,
      });

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });
});
