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

export default async function loadSwapConfigurations(
  chain: ChainType,
  proxyAddress: string,
) {
  const client = indexerForChain(chain);
  const proxyExists = await accountExists(chain, proxyAddress);

  if (!proxyExists) {
    return [] as SwapConfiguration[];
  }

  const ipfsPrefixBase64 = Buffer.from(`ipfs://`).toString(`base64`);
  const paymentTxns = await client
    .lookupAccountTransactions(proxyAddress)
    .notePrefix(ipfsPrefixBase64)
    .do();

  if (paymentTxns.transactions.length === 0) {
    return [] as SwapConfiguration[];
  }

  const swapConfigTxn = paymentTxns.transactions[0];

  const configFileUrl = Buffer.from(swapConfigTxn.note, `base64`).toString(
    `utf-8`,
  );

  const configFile = await axios
    .get(
      `https://${
        configFileUrl.split(`ipfs://`)[1]
      }.ipfs.dweb.link/aw_swaps.json`,
    )
    .then((res) => res.data);

  return configFile as SwapConfiguration[];
}
