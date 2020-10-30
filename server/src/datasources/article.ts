/* eslint-disable no-unused-vars */
import { Config } from 'apollo-server';
import { DataSource } from 'apollo-datasource';
import FeedStore from 'orbit-db-feedstore';
import OrbitDB from 'orbit-db';

import { Article, AddArticleInput } from '../generated/graphql';

interface FindFilter {
  gt?: string;
  gte?: string;
  lt?: string;
  lte?: string;
  limit?: number;
  reverse?: boolean;
}

export class ArticleService extends DataSource {
  context: Config['context'];

  db: OrbitDB;

  store: FeedStore<Article>;

  constructor({ db }: { db: OrbitDB }) {
    super();
    this.db = db;
  }

  initialize({ context }: Config) {
    this.context = context;
  }

  async loadStore() {
    if (this.store) return;

    this.store = await this.db.feed('article');
  }

  async findById(id: string) {
    await this.loadStore();

    const { hash, payload } = this.store.get(id) || {};

    return hash && ({
      ...payload.value,
      id: hash,
    });
  }

  async find(findFilter: FindFilter) {
    await this.loadStore();

    return this.store
      .iterator({
        limit: -1,
        reverse: true,
        ...findFilter,
      })
      .collect()
      .map(({ payload, hash }) => ({
        ...payload.value,
        id: hash,
      }));
  }

  async count() {
    await this.loadStore();

    return this.store
      .iterator({ limit: -1 })
      .collect()
      .length;
  }

  async create(input: AddArticleInput) {
    await this.loadStore();

    return this.store.add({
      ...input,
      createdAt: new Date().toISOString(),
    });
  }
}
export default ArticleService;
