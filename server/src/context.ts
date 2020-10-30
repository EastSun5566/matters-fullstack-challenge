/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { Config } from 'apollo-server';
import { ArticleService } from './datasources';

export type Context = Config['context'] & {
  dataSources: {
    ArticleService: InstanceType<typeof ArticleService>;
  },
};
