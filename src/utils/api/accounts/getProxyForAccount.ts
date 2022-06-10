import { SWAP_PROXY_VERSION } from '@/common/constants';
import { ChainType } from '@/models/Chain';
import getCompiledProxy from '../swaps/getCompiledProxy';
import getLogicSign from './getLogicSignature';

export default async function getProxyForAccount(
  address: string,
  chain: ChainType,
) {
  const compiledSwapProxy = await getCompiledProxy({
    swap_creator: address,
    version: SWAP_PROXY_VERSION,
    chain_type: chain,
  });
  const data = await compiledSwapProxy.data;

  return getLogicSign(data[`result`]);
}
