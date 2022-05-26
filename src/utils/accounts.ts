import { ChainType } from '@/models/Chain';
import { LogicSigAccount } from 'algosdk';
import { indexerForChain } from './algorand';

export const getLogicSign = (compiledContract: string) => {
  const program = new Uint8Array(Buffer.from(compiledContract, `base64`));
  return new LogicSigAccount(program, []);
};

export const accountExists = async (chain: ChainType, account: string) => {
  try {
    await indexerForChain(chain).lookupAccountByID(account).do();
    return true;
  } catch (e) {
    return false;
  }
};
