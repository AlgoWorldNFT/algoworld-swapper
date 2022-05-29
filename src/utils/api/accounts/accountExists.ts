import { ChainType } from '@/models/Chain';
import { indexerForChain } from '../algorand';

export default async function accountExists(chain: ChainType, account: string) {
  try {
    const response = await indexerForChain(chain)
      .lookupAccountByID(account)
      .do();
    console.log(response);
    return true;
  } catch (e) {
    return false;
  }
}
