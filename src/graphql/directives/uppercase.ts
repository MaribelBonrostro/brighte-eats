import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';

export function uppercaseDirectiveTransformer(
  schema: GraphQLSchema,
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, 'uppercase')?.[0];
      if (directive != null) {
        const originalResolver = fieldConfig.resolve ?? defaultFieldResolver;

        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await originalResolver(source, args, context, info);
          if (typeof result === 'string') {
            return result.toUpperCase();
          }
          return result;
        };
      }
      return fieldConfig;
    },
  });
}
