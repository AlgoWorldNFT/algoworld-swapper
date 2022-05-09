import { useLocalObservable } from 'mobx-react-lite';
import * as React from 'react';
import { Asset } from '@/models/Asset';
import { makeAutoObservable } from 'mobx';
const { createContext } = React;

const sortAssetsByNameAndAmount = (assets: Asset[]): Asset[] => {
  return assets
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort((a, b) => b.amount - a.amount);
};

class RootStore {
  owningAssets: Asset[] = [
    {
      index: 12345,
      name: `AW Card #1`,
      decimals: 0,
      unit_name: `CARD`,
      amount: 0,
      image_url: `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`,
    },
    {
      index: 12255,
      name: `AW Card #2`,
      decimals: 0,
      unit_name: `CARD`,
      amount: 0,
      image_url: `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`,
    },
  ];

  offeringAssets: Asset[] = [];
  requestingAssets: Asset[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setOwningAssets(assets: Asset[]) {
    this.owningAssets = sortAssetsByNameAndAmount(assets);
  }

  setOfferingAssets(assets: Asset[]) {
    this.offeringAssets = sortAssetsByNameAndAmount(assets);
  }

  setRequestingAssets(assets: Asset[]) {
    this.requestingAssets = sortAssetsByNameAndAmount(assets);
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
