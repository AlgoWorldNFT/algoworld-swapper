import { ChainType } from '@/models/Chain';
import { SubmitTransactionResponse } from '@/models/Transaction';
import { algodForChain } from '../algorand';
import waitForTransaction from './waitForTransaction';

export default async function submitTransactions(
  chain: ChainType,
  stxns: Uint8Array[],
): Promise<SubmitTransactionResponse> {
  const { txId } = await algodForChain(chain).sendRawTransaction(stxns).do();

  return {
    confirmedRound: await waitForTransaction(chain, txId),
    txId: txId,
  } as SubmitTransactionResponse;
}
