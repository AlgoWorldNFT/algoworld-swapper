import { SWAP_PROXY_VERSION } from '@/common/constants';
import getCompiledProxy from '../swaps/getCompiledProxy';
import getLogicSign from './getLogicSignature';

export default async function getProxyForAccount(address: string) {
  const compiledSwapProxy = await getCompiledProxy({
    swap_creator: address,
    version: SWAP_PROXY_VERSION,
  });
  const data = await compiledSwapProxy.data;

  return getLogicSign(data[`result`]);
}
