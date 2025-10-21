import { ulid } from 'serverless-crypto-utils/id-generation';

export const makeId = (): string => {
  return ulid();
};
