// @ts-ignore
import IPFS from 'ipfs';
import OrbitDB from 'orbit-db';

let db: OrbitDB;

// eslint-disable-next-line import/prefer-default-export
export const getOrbitDBClient = async () => {
  if (db) return db;

  // create IPFS instance
  // @ts-ignore
  const ipfs = await IPFS.create({ repo: './ipfs-repo' });

  db = await OrbitDB.createInstance(ipfs);

  return db;
};
