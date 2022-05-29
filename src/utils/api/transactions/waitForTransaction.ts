import { ChainType } from '@/models/Chain';
import { algodForChain } from '../algorand';

export default async function waitForTransaction(
  chain: ChainType,
  txId: string,
): Promise<number> {
  const client = algodForChain(chain);

  let lastStatus = await client.status().do();
  let lastRound = lastStatus[`last-round`];
  while (true) {
    const status = await client.pendingTransactionInformation(txId).do();
    if (status[`pool-error`]) {
      throw new Error(`Transaction Pool Error: ${status[`pool-error`]}`);
    }
    if (status[`confirmed-round`]) {
      return status[`confirmed-round`];
    }
    lastStatus = await client.statusAfterBlock(lastRound + 1).do();
    lastRound = lastStatus[`last-round`];
  }
}
