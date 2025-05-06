import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { PORT } from '../env';
import { contextFactory } from './context';

const INITIAL_MIDDLEWARES = [
  json(),
  cors({
    origin: true,
    maxAge: 0,
    allowedHeaders: [
      'Origin',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'X-Request-Id',
      'Sentry-Trace',
      'X-Tab-Session-Id',
      'Apollo-Require-Preflight',
    ],
  }),
];
// const loggerMiddleware = (req, res, next) => {
//   const operationType = req.body?.operationName || 'Unknown Operation';
//   const operationKind = req.body?.query?.trim().startsWith('mutation')
//     ? 'Mutation'
//     : 'Query';

//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   console.log(`GraphQL Operation: ${operationType} (${operationKind})`);
//   next();
// };

export class ExpressInitializer {
  constructor() {
    this.app = express();
    this.loadInitialMiddlewares();
  }

  loadInitialMiddlewares() {
    this.app.use(...INITIAL_MIDDLEWARES);
  }

  applyApolloMiddleware(apolloServer, db) {
    this.app.use(
      '/graphql',
      expressMiddleware(apolloServer, {
        context: async () => ({
          ...(await contextFactory()),
        }),
      }),
    );
  }

  start() {
    this.app.listen({ port: PORT }, () => {
      console.log(`Service endpoint :: http://localhost:${PORT}/graphql`);
    });
  }
}
