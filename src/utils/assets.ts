import { EMPTY_ASSET_IMAGE_URL } from '@/common/constants';
import { Asset } from '@/models/Asset';
import { indexerClient } from './algorand';
import { ipfsToProxyUrl } from './ipfsToProxyUrl';

const lookupAsset = async (index: number) => {
  let loadedAsset = await indexerClient.lookupAssetByID(index).do();
  loadedAsset = loadedAsset.asset;
  const assetParams = loadedAsset[`params`];
  console.log(assetParams);
  const asset = {
    index: loadedAsset[`index`],
    name: assetParams.hasOwnProperty(`name`) ? assetParams[`name`] : ``,
    imageUrl: assetParams.hasOwnProperty(`url`)
      ? ipfsToProxyUrl(assetParams[`url`])
      : EMPTY_ASSET_IMAGE_URL,
    decimals: assetParams[`decimals`],
    unitName: assetParams[`unit-name`],
    amount: assetParams[`total`],
    offeringAmount: 0,
    requestingAmount: 0,
  } as Asset;

  return asset;
};

export const loadOwningAssets = async (address: string) => {
  const response = await indexerClient.lookupAccountAssets(address).do();

  const assets: Asset[] = await Promise.all(
    response.assets.map((asset: Record<string, any>) => {
      return lookupAsset(asset[`asset-id`]);
    }),
  );

  return assets;
};
