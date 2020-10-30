/* eslint-disable no-unused-vars */
import { UserInputError } from 'apollo-server';

import { Context } from '../context';
import {
  QueryResolvers,
  MutationResolvers,
  ResolversTypes,
} from '../generated/graphql';

export const articles: QueryResolvers<Context>['articles'] = async (
  _,
  {
    first = -1,
    last = -1,
    after,
    before,
  },
  { dataSources: { ArticleService } },
): Promise<ResolversTypes['ArticleConnection']> => {
  const nodes = await ArticleService.find({ limit: first! || last!, lt: after!, gt: before! });
  const hasPrev = !!(await ArticleService.find({ gt: nodes[0]?.id })).length;
  const hasNext = !!(await ArticleService.find({ lt: nodes[nodes.length - 1]?.id })).length;
  const total = await ArticleService.count();

  return {
    nodes,
    pageInfo: {
      hasPrev,
      hasNext,
      total,
    },
  };
};

export const article: QueryResolvers<Context>['article'] = async (
  _,
  { id },
  { dataSources },
): Promise<ResolversTypes['Article']> => {
  const node = await dataSources.ArticleService.findById(id);

  if (!node) throw new UserInputError('Not Found');

  return node;
};

export const addArticle: MutationResolvers<Context>['addArticle'] = async (
  _,
  { input },
  { dataSources },
): Promise<ResolversTypes['Article']> => {
  const hash = await dataSources.ArticleService.create(input);

  return {
    id: hash,
    ...input,
  };
};
