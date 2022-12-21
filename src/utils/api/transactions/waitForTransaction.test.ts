import { ChainType } from '@/models/Chain';
import { algodForChain } from '../algorand';
import waitForTransaction from './waitForTransaction';

jest.mock(`../algorand`, () => ({
  algodForChain: jest.fn(),
}));

describe(`waitForTransaction`, () => {
  it(`should return the confirmed round when the transaction is confirmed`, async () => {
    const client = {
      status: jest.fn().mockReturnThis(),
      pendingTransactionInformation: jest.fn().mockReturnThis(),
      do: jest
        .fn()
        .mockResolvedValueOnce({ 'last-round': 100, 'pool-error': null })
        .mockResolvedValueOnce({ 'last-round': 100, 'pool-error': null })
        .mockResolvedValueOnce({ 'last-round': 100, 'pool-error': null })
        .mockResolvedValueOnce({
          'last-round': 100,
          'pool-error': null,
          'confirmed-round': 100,
        }),
      statusAfterBlock: jest.fn().mockReturnThis(),
    };
    (algodForChain as jest.Mock).mockReturnValue(client);

    const confirmedRound = await waitForTransaction(ChainType.TestNet, `TX_ID`);

    expect(confirmedRound).toBe(100);
  });

  it(`should throw an error if the transaction has a pool error`, async () => {
    const client = {
      status: jest.fn().mockReturnThis(),
      do: jest.fn().mockResolvedValue({
        'pool-error': `Transaction not found`,
        'last-round': 100,
      }),
      pendingTransactionInformation: jest.fn().mockReturnThis(),
    };
    (algodForChain as jest.Mock).mockReturnValue(client);

    await expect(
      waitForTransaction(ChainType.TestNet, `TX_ID`),
    ).rejects.toThrowError(`Transaction Pool Error: Transaction not found`);
  });
});
