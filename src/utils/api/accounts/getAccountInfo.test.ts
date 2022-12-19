import { ChainType } from '@/models/Chain';
import { indexerForChain } from '../algorand';
import getAccountInfo from './getAccountInfo';

jest.mock(`../algorand`, () => ({
  indexerForChain: jest.fn(),
}));

describe(`getAccountInfo`, () => {
  test(`returns account info for valid input`, async () => {
    const mockAccountInfo = {
      address: `someAddress`,
      balance: 1000,
    };

    (indexerForChain as jest.Mock).mockImplementationOnce(() => ({
      lookupAccountByID: jest.fn(() => ({
        do: jest.fn(() => mockAccountInfo),
      })),
    }));

    const chain = ChainType.TestNet;
    const account = `someAccount`;
    const result = await getAccountInfo(chain, account);
    expect(result).toEqual(mockAccountInfo);
  });

  test(`returns undefined for invalid input`, async () => {
    (indexerForChain as jest.Mock).mockImplementationOnce(() => ({
      lookupAccountByID: jest.fn(() => ({
        do: jest.fn(() => {
          throw new Error();
        }),
      })),
    }));

    const chain = ChainType.TestNet;
    const account = `someAccount`;
    const result = await getAccountInfo(chain, account);
    expect(result).toBeUndefined();
  });
});
