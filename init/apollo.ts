import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from '../src/graphql/resolvers';
import typeDefs from '../src/graphql/schema';

export class ApolloServerInitializer {
  public schema: any;
  public server: ApolloServer;

  constructor() {
    this.schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    this.server = new ApolloServer({
      schema: this.schema,
      introspection: true,
    });
  }

  async start() {
    await this.server.start();
  }
}
