import { useLocalObservable } from 'mobx-react-lite';
import * as React from 'react';
import { Asset } from '@/models/Asset';
import { makeAutoObservable } from 'mobx';
const { createContext } = React;

class RootStore {
  owningAssets: Asset[] = [];
  requestedAssets: Asset[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setOwningAssets(assets: Asset[]) {
    this.owningAssets = assets;
  }
  setRequestedAssets(assets: Asset[]) {
    this.requestedAssets = assets;
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
