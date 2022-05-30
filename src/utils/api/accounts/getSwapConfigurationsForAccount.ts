import { SWAP_PROXY_VERSION } from '@/common/constants';
import { ChainType } from '@/models/Chain';
import getLogicSign from '../accounts/getLogicSignature';
import getCompiledProxy from '../swaps/getCompiledProxy';
import loadSwapConfigurations from '../swaps/loadSwapConfigurations';

export default async function getSwapConfigurationsForAccount(
  chain: ChainType,
  address: string,
) {
  const compiledSwapProxy = await getCompiledProxy({
    swap_creator: address,
    version: SWAP_PROXY_VERSION,
  });
  const data = await compiledSwapProxy.data;

  const proxyLsig = getLogicSign(data[`result`]);

  return loadSwapConfigurations(chain, proxyLsig.address());
}
