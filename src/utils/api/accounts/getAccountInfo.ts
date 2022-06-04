import { ChainType } from '@/models/Chain';
import { indexerForChain } from '../algorand';

export default async function getAccountInfo(
  chain: ChainType,
  account: string,
) {
  try {
    const response = await indexerForChain(chain)
      .lookupAccountByID(account)
      .do();
    return response;
  } catch (e) {
    return undefined;
  }
}
