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
import { indexerForChain } from '../algorand';

export default async function getAssetBalance(
  index: number,
  account: string,
  chain: ChainType,
): Promise<number> {
  try {
    const response = await indexerForChain(chain)
      .lookupAccountByID(account)
      .exclude(`created-assets,apps-local-state,created-apps`)
      .do();

    const asset = response.account.assets.filter(
      (asset: { [x: string]: number }) => {
        return asset[`asset-id`] === index;
      },
    );

    if (asset.length === 1) {
      return asset[0][`amount`];
    }

    return -1;
  } catch (e) {
    return -1;
  }
}
