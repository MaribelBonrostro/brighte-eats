import {
  ExpressInitializer,
  ApolloServerInitializer,
  dbInitializer,
} from './init';

import { createServer } from 'http';
import { PORT } from './env';

const startServer = async () => {
  const { db, connectToDb } = await dbInitializer();
  await connectToDb();

  const expressApp = new ExpressInitializer();
  const apolloServer = new ApolloServerInitializer();
  const httpServer = createServer(expressApp.app);

  await apolloServer.start();
  expressApp.applyApolloMiddleware(apolloServer.server, db);
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
};
startServer();
