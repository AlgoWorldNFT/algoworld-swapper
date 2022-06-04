import { Asset } from '@/models/Asset';

export default function getAssetsToOptIn(
  newAssets: Asset[],
  existingAssets: Asset[],
) {
  const newAssetIndexes = newAssets.map((asset) => asset.index);
  const existingAssetIndexes = existingAssets.map((asset) => asset.index);

  const indexesToOptIn = [];

  for (const index of newAssetIndexes) {
    if (!existingAssetIndexes.includes(index)) {
      indexesToOptIn.push(index);
    }
  }

  return indexesToOptIn;
}
