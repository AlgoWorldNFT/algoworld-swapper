// tests for accountExists.ts

import { ChainType } from '@/models/Chain';
import accountExists from './accountExists';

jest.mock(`../algorand`, () => ({
  indexerForChain: jest.fn(() => ({
    lookupAccountByID: jest.fn(() => ({
      do: jest.fn(() => Promise.resolve()),
    })),
  })),
}));

describe(`accountExists`, () => {
  it(`returns true if account exists`, async () => {
    const result = await accountExists(ChainType.MainNet, `test`);
    expect(result).toBe(true);
  });
});
