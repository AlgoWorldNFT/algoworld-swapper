import { ChainType } from '@/models/Chain';
import algosdk from 'algosdk';
import { algodForChain } from '../algorand';

export default async function getTransactionParams(
  chain: ChainType,
): Promise<algosdk.SuggestedParams> {
  const params = await algodForChain(chain).getTransactionParams().do();
  return params;
}
