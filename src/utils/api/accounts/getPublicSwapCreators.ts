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

import {
  ALGOEXPLORER_INDEXER_URL,
  ALGONODE_INDEXER_URL,
  AWVT_ASSET_INDEX,
  AWVT_CREATOR_ADDRESS,
} from '@/common/constants';
import { ChainType } from '@/models/Chain';
import { IpfsGateway } from '@/models/Gateway';
import filterAsync from '@/utils/filterAsync';
import axios from 'axios';
import getSwapConfigurationsForAccount from './getSwapConfigurationsForAccount';

export default async function getPublicSwapCreators(
  assetId: number,
  gateway: IpfsGateway,
  chain: ChainType,
  limit = 10,
  nextToken?: string,
) {
  let url = `${ALGOEXPLORER_INDEXER_URL(
    chain,
  )}/v2/accounts?asset-id=${assetId}&limit=${limit}&exclude=all`;

  if (nextToken) {
    url += `&next=${nextToken}`;
  }

  try {
    const res = await axios.get(url);
    const data = res.data;

    const addressesWithAwvt = await filterAsync(
      data.accounts,
      async (account: { address: string }) => {
        try {
          const accountInfoUrl = `${ALGONODE_INDEXER_URL(chain)}/v2/accounts/${
            account.address
          }?&exclude=created-apps,created-assets,apps-local-state`;
          const response = await axios.get(accountInfoUrl);
          const accountData = response.data;

          const hasAwvtOptedIn =
            accountData &&
            `account` in accountData &&
            `assets` in accountData[`account`]
              ? accountData[`account`][`assets`].some(
                  (value: { [x: string]: number }) =>
                    value[`asset-id`] === AWVT_ASSET_INDEX(chain),
                )
              : false;

          const hasPrereqs =
            hasAwvtOptedIn && account.address !== AWVT_CREATOR_ADDRESS(chain);

          if (!hasPrereqs) {
            return false;
          }

          const swapConfigs = (
            await getSwapConfigurationsForAccount(
              chain,
              gateway,
              account.address,
            )
          ).filter((config) => config.isPublic);

          return swapConfigs && swapConfigs.length > 0;
        } catch (e) {
          return false;
        }
      },
    );

    const rawAddresses = addressesWithAwvt.map(
      (account: { address: string }) => account.address,
    );

    return {
      accounts: rawAddresses,
      nextToken: `next-token` in data ? data[`next-token`] : undefined,
    };
  } catch (e) {
    return { accounts: [], nextToken: undefined };
  }
}
