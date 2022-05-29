import { SWAP_PROXY_VERSION } from '@/common/constants';
import { ChainType } from '@/models/Chain';
import { SwapConfiguration } from '@/models/Swap';
import axios from 'axios';
import accountExists from '../accounts/accountExists';
import getLogicSign from '../accounts/getLogicSignature';
import { indexerForChain } from '../algorand';
import getCompiledProxy from './getCompiledProxy';

export default async function loadSwapConfigurations(
  chain: ChainType,
  address: string,
) {
  const compiledSwapProxy = await getCompiledProxy({
    swap_creator: address,
    version: SWAP_PROXY_VERSION,
  });
  const data = await compiledSwapProxy.data;

  const proxyLsig = getLogicSign(data[`result`]);

  const client = indexerForChain(chain);

  const proxyExists = await accountExists(chain, proxyLsig.address());

  if (!proxyExists) {
    return [] as SwapConfiguration[];
  }

  const paymentTxns = await client
    .lookupAccountTransactions(proxyLsig.address())
    .do();

  if (paymentTxns.transactions.length === 0) {
    return [] as SwapConfiguration[];
  }

  console.log(paymentTxns.transactions);

  const swapConfigTxn = paymentTxns.transactions[0];
  const configFileUrl = Buffer.from(swapConfigTxn.note, `base64`).toString(
    `utf-8`,
  );
  if (configFileUrl.includes(`ipfs`)) {
    const configFile = await axios
      .get(
        `https://${
          configFileUrl.split(`ipfs://`)[1]
        }.ipfs.cf-ipfs.com/aw_swaps.json`,
      )
      .then((res) => res.data);
    console.log(configFile);
    return configFile as SwapConfiguration[];
  }
  return [] as SwapConfiguration[];
}
