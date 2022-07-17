import { Asset } from '@/models/Asset';
import getAssetsToOptIn from './getAssetsToOptIn';

describe(`getAssetsToOptIn`, () => {
  it(`runs correctly`, () => {
    const expectedIndexToOptIn = 123;
    const assetToOptIn = {
      index: expectedIndexToOptIn,
      creator: `test`,
      name: `test`,
      imageUrl: `test`,
      decimals: 6,
      unitName: `test`,
      amount: 1,
      frozen: false,
      offeringAmount: 0,
      requestingAmount: 0,
    } as Asset;

    const existingAsset = {
      index: 456,
      creator: `test`,
      name: `test`,
      imageUrl: `test`,
      decimals: 6,
      unitName: `test`,
      amount: 1,
      frozen: false,
      offeringAmount: 0,
      requestingAmount: 0,
    } as Asset;

    expect(getAssetsToOptIn([assetToOptIn], [existingAsset])).toStrictEqual([
      expectedIndexToOptIn,
    ]);

    expect(getAssetsToOptIn([], [])).toStrictEqual([]);

    expect(getAssetsToOptIn([], [existingAsset])).toStrictEqual([]);
  });
});
