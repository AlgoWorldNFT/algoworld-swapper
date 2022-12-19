import { ChainType } from '@/models/Chain';
import { indexerForChain } from '../algorand';
import getAccountsHoldingAsset from './getAccountsHoldingAsset';

jest.mock(`../algorand`, () => ({
  indexerForChain: jest.fn(),
}));

describe(`getAccountsHoldingAsset`, () => {
  test(`returns accounts holding asset for valid input`, async () => {
    const mockAccounts = [
      {
        address: `someAddress1`,
        balance: 1000,
      },
      {
        address: `someAddress2`,
        balance: 2000,
      },
    ];

    (indexerForChain as jest.Mock).mockImplementationOnce(() => ({
      searchAccounts: jest.fn(() => ({
        assetID: jest.fn(() => ({
          limit: jest.fn(() => ({
            do: jest.fn(() => mockAccounts),
          })),
        })),
      })),
    }));

    const assetId = 123;
    const chain = ChainType.TestNet;
    const result = await getAccountsHoldingAsset(assetId, chain);
    expect(result).toEqual(mockAccounts);
  });

  test(`returns accounts holding asset using next token`, async () => {
    const mockAccounts = [
      {
        address: `someAddress1`,
        balance: 1000,
      },
      {
        address: `someAddress2`,
        balance: 2000,
      },
    ];

    (indexerForChain as jest.Mock).mockImplementationOnce(() => ({
      searchAccounts: jest.fn(() => ({
        assetID: jest.fn(() => ({
          limit: jest.fn(() => ({
            nextToken: jest.fn(() => ({
              do: jest.fn(() => mockAccounts),
            })),
          })),
        })),
      })),
    }));

    const assetId = 123;
    const chain = ChainType.TestNet;
    const nextToken = `someNextToken`;
    const result = await getAccountsHoldingAsset(assetId, chain, nextToken);
    expect(result).toEqual(mockAccounts);
  });
});
