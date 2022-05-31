import { ChainType } from '@/models/Chain';
import { SwapConfiguration } from '@/models/Swap';
import axios from 'axios';
import accountExists from '../accounts/accountExists';
import { indexerForChain } from '../algorand';

export default async function loadSwapConfigurations(
  chain: ChainType,
  proxyAddress: string,
) {
  const client = indexerForChain(chain);
  const proxyExists = await accountExists(chain, proxyAddress);

  if (!proxyExists) {
    return [] as SwapConfiguration[];
  }

  const paymentTxns = await client.lookupAccountTransactions(proxyAddress).do();

  if (paymentTxns.transactions.length === 0) {
    return [] as SwapConfiguration[];
  }

  const swapConfigTxn = paymentTxns.transactions[0];
  const configFileUrl = Buffer.from(swapConfigTxn.note, `base64`).toString(
    `utf-8`,
  );

  console.log(configFileUrl);
  if (configFileUrl.includes(`ipfs`)) {
    const configFile = await axios
      .get(
        `https://${
          configFileUrl.split(`ipfs://`)[1]
        }.ipfs.cf-ipfs.com/aw_swaps.json`,
      )
      .then((res) => res.data);
    console.log(`config` + configFile);
    return configFile as SwapConfiguration[];
  } else {
    return [] as SwapConfiguration[];
  }
}
