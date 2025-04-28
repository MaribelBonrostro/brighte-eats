import { eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { PgTable } from 'drizzle-orm/pg-core';
import { Pool } from 'pg';

interface BaseRepositoryInterface<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  insert(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<T>;
}

export class BaseRepository<T extends PgTable>
  implements BaseRepositoryInterface<InferSelectModel<T>>
{
  private table: T;
  public db: ReturnType<typeof drizzle>;

  constructor(table: T, pool: Pool) {
    this.table = table;
    this.db = drizzle(pool);
  }

  // Find all records
  async findAll(): Promise<any[]> {
    try {
      return await this.db.select().from(this.table).execute();
    } catch (error) {
      console.error('Error fetching all records:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const result = await this.db
        .select()
        .from(this.table)
        .where(eq((this.table as any).id, id)) // Ensure the column is properly referenced
        .limit(1)
        .execute();

      return (result[0] as T) || null;
    } catch (error) {
      console.error('Error fetching record by ID:', error);
      throw error;
    }
  }

  async insert(data: Partial<InferInsertModel<T>>): Promise<any> {
    try {
      return await this.db
        .insert(this.table)
        .values(data)
        .returning()
        .execute();
      console;
    } catch (error) {
      console.error('Error inserting record:', error);
      throw error;
    }
  }

  async update(
    condition: Partial<InferSelectModel<T>>,
    data: Partial<InferInsertModel<T>>,
  ): Promise<InferSelectModel<T>> {
    try {
      // Build dynamic condition
      const conditions = Object.entries(condition).map(([key, value]) =>
        eq((this.table as any)[key], value),
      );

      const whereCondition =
        conditions.length > 1 ? and(...conditions) : conditions[0];

      const result = await this.db
        .update(this.table)
        .set(data)
        .where(whereCondition)
        .returning()
        .execute();

      return result[0];
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  }

  async delete(condition: any): Promise<any> {
    try {
      return await this.db
        .delete(this.table)
        .where(condition)
        .returning('*')
        .execute();
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  }
}
