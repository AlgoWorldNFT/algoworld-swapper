import { useLocalObservable } from 'mobx-react-lite';
import * as React from 'react';
import { Asset } from '@/models/Asset';
import { observable } from 'mobx';
const { createContext } = React;

class RootStore {
  owningAssets = observable<Asset>([
    {
      index: 12345,
      name: `AW Card #1`,
      decimals: 0,
      unit_name: `CARD`,
      amount: 0,
      offeringAmount: 0,
      requestingAmount: 0,
      image_url: `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`,
    },
    {
      index: 12255,
      name: `AW Card #2`,
      decimals: 0,
      unit_name: `CARD`,
      amount: 2,
      offeringAmount: 0,
      requestingAmount: 0,
      image_url: `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`,
    },
  ]);
  offeringAssets = observable<Asset>([]);
  requestingAssets = observable<Asset>([]);

  private getAssetIndex(assets: Asset[], asset: Asset | Asset | Asset) {
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

  addOfferingAssets(asset: Asset) {
    if (this.getAssetIndex(this.offeringAssets, asset) === -1) {
      this.offeringAssets.push(asset);
    }
  }

  setOfferingAssets(assets: Asset[]) {
    this.offeringAssets = observable<Asset>(assets);
  }

  setRequestingAssets(assets: Asset[]) {
    this.requestingAssets = observable<Asset>(assets);
  }

  updateOfferingAssetAmount(asset: Asset, amount: number) {
    const assetIndex = this.getAssetIndex(this.offeringAssets, asset);
    if (assetIndex > -1) {
      this.offeringAssets[assetIndex].amount = amount;
    }
  }

  deleteOfferingAssets(asset: Asset) {
    const assetIndex = this.getAssetIndex(this.offeringAssets, asset);
    if (assetIndex > -1) {
      this.offeringAssets.remove(this.offeringAssets[assetIndex]);
    }
  }

  addRequestingAssets(asset: Asset) {
    if (this.getAssetIndex(this.requestingAssets, asset) === -1) {
      this.requestingAssets.push(asset);
    }
  }

  updateRequestingAssetAmount(asset: Asset, amount: number) {
    const assetIndex = this.getAssetIndex(this.requestingAssets, asset);
    if (assetIndex > -1) {
      this.requestingAssets[assetIndex].amount = amount;
    }
  }

  deleteRequestingAssets(asset: Asset) {
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
