import gql from 'graphql-tag';
import lead from './lead';

const baseSchema = gql`
  scalar JSON
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [baseSchema, lead];
