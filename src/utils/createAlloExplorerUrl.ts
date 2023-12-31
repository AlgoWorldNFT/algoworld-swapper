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

import { ALLO_EXPLORER_URL } from '@/common/constants';
import AlloExplorerUrlType from '@/models/AlloExplorerUrlType';
import { ChainType } from '@/models/Chain';

function alloExplorerUrlTypeToPath(type: AlloExplorerUrlType) {
  switch (type) {
    case AlloExplorerUrlType.Transaction:
      return `tx`;
    case AlloExplorerUrlType.Address:
      return `account`;
    case AlloExplorerUrlType.Asset:
      return `asset`;
  }
}

export default function createAlloExplorerUrl(
  chain: ChainType,
  input: string,
  type: AlloExplorerUrlType,
) {
  return `${ALLO_EXPLORER_URL(chain)}/${alloExplorerUrlTypeToPath(
    type,
  )}/${input}`;
}
