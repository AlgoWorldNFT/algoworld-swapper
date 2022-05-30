import { ChainType } from '@/models/Chain';
import { indexerForChain } from '../algorand';

export default async function accountExists(chain: ChainType, account: string) {
  try {
    await indexerForChain(chain).lookupAccountByID(account).do();
    return true;
  } catch (e) {
    return false;
  }
}
