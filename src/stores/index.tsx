import { useLocalObservable } from 'mobx-react-lite';
import * as React from 'react';
import { Asset, OfferingAsset, RequestingAsset } from '@/models/Asset';
import { observable } from 'mobx';
const { createContext } = React;

class RootStore {
  owningAssets = observable<Asset>([
    {
      index: 12345,
      name: `AW Card #1`,
      decimals: 0,
      unit_name: `CARD`,
      availableAmount: 0,
      image_url: `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`,
    },
    {
      index: 12255,
      name: `AW Card #2`,
      decimals: 0,
      unit_name: `CARD`,
      availableAmount: 2,
      image_url: `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`,
    },
  ]);
  offeringAssets = observable<OfferingAsset>([]);
  requestingAssets = observable<RequestingAsset>([]);

  private getAssetIndex(
    assets: Asset[],
    asset: Asset | OfferingAsset | RequestingAsset,
  ) {
    const assetIndex = assets.findIndex(
      (storedAsset) => storedAsset.index == asset.index,
    );
    return assetIndex;
  }

  addOwningAsset(asset: Asset) {
    if (this.getAssetIndex(this.owningAssets, asset) === -1) {
      this.owningAssets.push(asset);
    }
  }

  deleteOwningAsset(asset: Asset) {
    const assetIndex = this.getAssetIndex(this.owningAssets, asset);

    if (this.getAssetIndex(this.owningAssets, asset) > -1) {
      this.owningAssets.remove(this.owningAssets[assetIndex]);
    }
  }

  addOfferingAssets(asset: OfferingAsset) {
    if (this.getAssetIndex(this.offeringAssets, asset) === -1) {
      this.offeringAssets.push(asset);
    }
  }

  updateOfferingAssetAmount(asset: OfferingAsset, amount: number) {
    const assetIndex = this.getAssetIndex(this.offeringAssets, asset);
    if (assetIndex > -1) {
      this.offeringAssets[assetIndex].amount = amount;
    }
  }

  deleteOfferingAssets(asset: OfferingAsset) {
    const assetIndex = this.getAssetIndex(this.offeringAssets, asset);
    if (assetIndex > -1) {
      this.offeringAssets.remove(this.offeringAssets[assetIndex]);
    }
  }

  addRequestingAssets(asset: RequestingAsset) {
    if (this.getAssetIndex(this.requestingAssets, asset) === -1) {
      this.requestingAssets.push(asset);
    }
  }

  updateRequestingAssetAmount(asset: RequestingAsset, amount: number) {
    const assetIndex = this.getAssetIndex(this.requestingAssets, asset);
    if (assetIndex > -1) {
      this.requestingAssets[assetIndex].amount = amount;
    }
  }

  deleteRequestingAssets(asset: RequestingAsset) {
    const assetIndex = this.getAssetIndex(this.requestingAssets, asset);
    if (assetIndex > -1) {
      this.requestingAssets.remove(this.requestingAssets[assetIndex]);
    }
  }
}

type Props = {
  children: React.ReactNode;
};

export const RootContext = createContext<RootStore>(new RootStore());

export const Provider = (props: Props) => {
  const localStore = useLocalObservable(() => new RootStore());

  return (
    <RootContext.Provider value={localStore}>
      {props.children}
    </RootContext.Provider>
  );
};
