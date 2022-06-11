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
