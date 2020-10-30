/* eslint-disable no-new */
/**
 * This is an incomplete script of apollo server. Please
 * make it live with features we requested. :)
 */
import { ApolloServer } from 'apollo-server';

import * as types from './schema';
import { resolvers } from './resolvers';
import * as sources from './datasources';

import { getOrbitDBClient } from './db/orbitdb';

require('dotenv').config();

(async () => {
  const db = await getOrbitDBClient();

  const dataSources = Object
    .entries(sources)
    .map(([name, Source]) => ({
      [name]: new Source({ db }),
    }))
    .reduce((pre, cur) => ({ ...pre, ...cur }), {});

  // init server
  const server = new ApolloServer({
    debug: true,
    typeDefs: Object.values(types),
    // @ts-ignore
    resolvers,
    dataSources: () => dataSources,
  });

  const port = process.env.SERVER_PORT || 4000;

  // run server up
  server
    .listen({ port })
    .then(({ url }) => console.log(`Server is ready at ${url}`));
})();
