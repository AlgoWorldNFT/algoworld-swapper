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

import { EMPTY_ASSET_IMAGE_URL } from '@/common/constants';
import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import { ipfsToProxyUrl } from '@/utils/ipfsToProxyUrl';
import algosdk from 'algosdk';
import { algodForChain } from '../algorand';

export default async function getAssetsForAccount(
  chain: ChainType,
  address: string,
) {
  const client = algodForChain(chain);

  const accountInfo = await client
    .accountInformation(address)
    .setIntDecoding(algosdk.IntDecoding.BIGINT)
    .do();

  const algoBalance = Number(accountInfo.amount.toString());
  const assetsFromRes: Array<{
    'asset-id': bigint;
    amount: bigint;
    'is-frozen': boolean;
  }> = accountInfo.assets;

  const assets: Asset[] = assetsFromRes.map(
    ({ 'asset-id': id, amount, 'is-frozen': frozen }) => ({
      creator: ``,
      index: Number(id),
      name: ``,
      imageUrl: EMPTY_ASSET_IMAGE_URL,
      decimals: 0,
      unitName: ``,
      amount: Number(amount),
      offeringAmount: 0,
      frozen: frozen,
      requestingAmount: 0,
    }),
  );

  assets.sort((a, b) => a.index - b.index);

  await Promise.all(
    assets.map((asset, i) => {
      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          try {
            const assetResponse = await client.getAssetByID(asset.index).do();
            const assetParams = assetResponse[`params`];

            asset[`name`] = assetParams.hasOwnProperty(`name`)
              ? assetParams[`name`]
              : ``;
            asset[`imageUrl`] = assetParams.hasOwnProperty(`url`)
              ? ipfsToProxyUrl(assetParams[`url`])
              : EMPTY_ASSET_IMAGE_URL;
            asset[`decimals`] = assetParams[`decimals`];
            asset[`unitName`] = assetParams[`unit-name`];
            asset[`creator`] = assetParams[`creator`];
          } catch (error) {}
          resolve();
        }, 25 * i);
      });
    }),
  );

  assets.unshift({
    index: 0,
    amount: algoBalance,
    creator: ``,
    frozen: false,
    imageUrl: EMPTY_ASSET_IMAGE_URL,
    decimals: 6,
    name: `Algo`,
    unitName: `Algo`,
    offeringAmount: 0,
    requestingAmount: 0,
  });

  return assets;
}
