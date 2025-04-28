import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { PORT } from '../env';
import { contextFactory } from './context';
import repositories from '../src/data/repositories';

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
          ...await contextFactory(),
        })
      }),
    );
  }

  start() {
    this.app.listen({ port: PORT }, () => {
      console.log(`Service endpoint :: http://localhost:${PORT}/graphql`);
    });
  }
}
