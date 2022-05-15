import { EMPTY_ASSET_IMAGE_URL } from '@/common/constants';
import { Asset } from '@/models/Asset';
import { indexerClient } from './algorand';

export const loadOwningAssets = async (address: string) => {
  let assets = await indexerClient.lookupAccountAssets(address).do();
  assets = assets.map((rawAsset: any) => {
    const assetParams = rawAsset[`params`];
    return {
      index: rawAsset[`index`],
      name: assetParams.hasOwnProperty(`name`) ? assetParams[`name`] : ``,
      imageUrl: assetParams.hasOwnProperty(`url`)
        ? assetParams[`url`]
        : EMPTY_ASSET_IMAGE_URL,
      decimals: assetParams[`decimals`],
      unitName: assetParams[`unit-name`],
      amount: 0,
      offeringAmount: 0,
      requestingAmount: 0,
    } as Asset;
  });

  return assets;
};
