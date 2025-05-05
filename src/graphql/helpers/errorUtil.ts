import { GraphQLError } from 'graphql';

export const createGraphQLError = (
  message: string,
  code: string,
  status: number,
) => {
  return new GraphQLError(message, {
    extensions: {
      code,
      status,
    },
  });
};
