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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ChainType } from '@/models/Chain';
import algosdk from 'algosdk';

const mainNetAlgodClient = new algosdk.Algodv2(
  ``,
  `https://mainnet-api.algonode.cloud`,
  ``,
);
const testNetAlgodClient = new algosdk.Algodv2(
  ``,
  `https://testnet-api.algonode.cloud`,
  ``,
);

const mainNetIndexerClient = new algosdk.Indexer(
  ``,
  `https://mainnet-idx.algonode.cloud`,
  ``,
);
const testNetIndexerClient = new algosdk.Indexer(
  ``,
  `https://testnet-idx.algonode.cloud`,
  ``,
);

export const algodForChain = (chain: ChainType): algosdk.Algodv2 => {
  switch (chain) {
    case ChainType.MainNet:
      return mainNetAlgodClient;
    case ChainType.TestNet:
      return testNetAlgodClient;
    default:
      throw new Error(`Unknown chain type: ${chain}`);
  }
};

export const indexerForChain = (chain: ChainType): algosdk.Indexer => {
  switch (chain) {
    case ChainType.MainNet:
      return mainNetIndexerClient;
    case ChainType.TestNet:
      return testNetIndexerClient;
    default:
      throw new Error(`Unknown chain type: ${chain}`);
  }
};
