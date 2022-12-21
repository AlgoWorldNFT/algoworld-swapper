import { ChainType } from '@/models/Chain';
import { algodForChain } from '../algorand';
import submitTransactions from './submitTransactions';
import waitForTransaction from './waitForTransaction';

jest.mock(`../algorand`, () => ({
  algodForChain: jest.fn(),
}));

jest.mock(`./waitForTransaction`, () => jest.fn());

describe(`submitTransactions`, () => {
  it(`should return the transaction ID and confirmed round if the transaction is successful`, async () => {
    const client = {
      sendRawTransaction: jest.fn().mockReturnThis(),
      do: jest.fn().mockResolvedValue({ txId: `TX_ID` }),
    };
    (algodForChain as jest.Mock).mockReturnValue(client);
    (waitForTransaction as jest.Mock).mockResolvedValue(123);

    const response = await submitTransactions(ChainType.TestNet, []);

    expect(response).toEqual({
      confirmedRound: 123,
      txId: `TX_ID`,
    });
  });

  it(`should return the transaction ID and undefined confirmed round if the transaction is unsuccessful`, async () => {
    const client = {
      sendRawTransaction: jest.fn().mockReturnThis(),
      do: jest.fn().mockRejectedValue(new Error(`Transaction failed`)),
    };
    (algodForChain as jest.Mock).mockReturnValue(client);

    const response = await submitTransactions(ChainType.TestNet, []);

    expect(response).toEqual({
      confirmedRound: undefined,
      txId: undefined,
    });
  });
});
