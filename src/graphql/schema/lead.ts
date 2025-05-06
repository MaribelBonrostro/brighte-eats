import gql from 'graphql-tag';

export default gql`
  directive @uppercase on FIELD_DEFINITION
  enum Service {
    delivery
    pick_up
    payment
  }

  type Lead {
    id: ID!
    name: String @uppercase
    email: String
    postcode: String
    mobile: String
    services: [Service!]!
  }

  type LeadQueries {
    leads: [Lead]
    lead(id: ID!): Lead
    leadsByService(service: Service!): [Lead]
  }

  extend type Query {
    lead: LeadQueries
  }

  input LeadInput {
    name: String!
    email: String!
    postcode: String
    mobile: String
    services: [Service!]!
  }

  type LeadMutations {
    create(input: LeadInput!): Lead
  }
  extend type Mutation {
    lead: LeadMutations
  }
`;
