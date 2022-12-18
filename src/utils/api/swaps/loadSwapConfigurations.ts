/**
 * AlgoWorld Swapper
 * Copyright (C) 2022 AlgoWorld
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ChainType } from '@/models/Chain';
import { SwapConfiguration } from '@/models/Swap';
import axios from 'axios';
import accountExists from '../accounts/accountExists';
import { indexerForChain } from '../algorand';
import axiosRetry from 'axios-retry';
import { ipfsToProxyUrl } from '@/utils/ipfsToProxyUrl';
import { IpfsGateway } from '@/models/Gateway';

const ipfsPrefixBase64 = Buffer.from(`ipfs://`).toString(`base64`);

// Exponential back-off retry delay between requests
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

export default async function loadSwapConfigurations(
  chain: ChainType,
  gateway: IpfsGateway,
  proxyAddress: string,
  loadAll = false,
) {
  const client = indexerForChain(chain);
  const proxyExists = await accountExists(chain, proxyAddress);

  if (!proxyExists) {
    return [] as SwapConfiguration[];
  }

  const paymentTxns = await client
    .lookupAccountTransactions(proxyAddress)
    .notePrefix(ipfsPrefixBase64)
    .do();

  if (paymentTxns.transactions.length === 0) {
    return [] as SwapConfiguration[];
  }

  if (loadAll) {
    const swapConfigurations = {} as { [key: string]: SwapConfiguration };
    for (const txn of paymentTxns.transactions) {
      const swapConfigTxn = txn;
      const configFileUrl = Buffer.from(swapConfigTxn.note, `base64`).toString(
        `utf-8`,
      );
      const configFile = await axios
        .get(`${ipfsToProxyUrl(configFileUrl, gateway)}/aw_swaps.json`)
        .then((res) => res.data);

      for (const swapConfig of configFile) {
        swapConfigurations[swapConfig.escrow] = swapConfig;
      }
    }
    return Object.keys(swapConfigurations).map(function (key) {
      return swapConfigurations[key];
    });
  }

  const swapConfigTxn = paymentTxns.transactions[0];

  const configFileUrl = Buffer.from(swapConfigTxn.note, `base64`).toString(
    `utf-8`,
  );

  const configFile = await axios
    .get(`${ipfsToProxyUrl(configFileUrl, gateway)}/aw_swaps.json`)
    .then((res) => res.data);
  return configFile as SwapConfiguration[];
}
