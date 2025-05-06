import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from '../src/graphql/resolvers';
import typeDefs from '../src/graphql/schema';
import { uppercaseDirectiveTransformer } from '../src/graphql/directives/uppercase';

export class ApolloServerInitializer {
  public schema: any;
  public server: ApolloServer;

  constructor() {
    let schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    schema = uppercaseDirectiveTransformer(schema);
    this.schema = schema;

    this.server = new ApolloServer({
      schema: this.schema,
      introspection: true,
    });
  }

  async start() {
    await this.server.start();
  }
}
