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
  AWVT_ASSET_INDEX,
  CHAIN_TYPE,
  EMPTY_ASSET_IMAGE_URL,
  LATEST_SWAP_PROXY_VERSION,
} from '@/common/constants';
import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import { SwapConfiguration } from '@/models/Swap';
import getAssetsForAccount from '@/utils/api/accounts/getAssetsForAccount';
import getLogicSign from '@/utils/api/accounts/getLogicSignature';
import getSwapConfigurationsForAccount from '@/utils/api/accounts/getSwapConfigurationsForAccount';
import getCompiledProxy from '@/utils/api/swaps/getCompiledProxy';

import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { LogicSigAccount } from 'algosdk';
import { RootState } from '@/redux/store';
import optAssetsForAccount from '@/utils/api/accounts/optAssetsForAccount';
import WalletManager from '@/utils/wallets/walletManager';

interface WalletConnectState {
  chain: ChainType;
  accounts: string[];
  address: string;
  assets: Asset[];
  fetching: boolean;
  fetchingSwaps: boolean;
  proxy: LogicSigAccount;
  swaps: SwapConfiguration[];
  selectedOfferingAssets: Asset[];
  selectedRequestingAssets: Asset[];
  hasAwvt: boolean;
}

const initialState = {
  accounts: [],
  address: ``,
  proxy: {} as LogicSigAccount,
  assets: [
    {
      index: 0,
      amount: 0,
      creator: ``,
      frozen: false,
      decimals: 6,
      offeringAmount: 0,
      requestingAmount: 0,
      imageUrl: EMPTY_ASSET_IMAGE_URL,
      name: `Algo`,
      unitName: `Algo`,
    },
  ],
  selectedOfferingAssets: [],
  selectedRequestingAssets: [],
  chain: CHAIN_TYPE,
  swaps: [],
  fetching: false,
  fetchingSwaps: false,
  hasAwvt: false,
} as WalletConnectState;

export const getAccountAssets = createAsyncThunk(
  `walletConnect/getAccountAssets`,
  async ({ chain, address }: { chain: ChainType; address: string }) => {
    return await getAssetsForAccount(chain, address);
  },
);

export const getProxy = createAsyncThunk(
  `walletConnect/getProxy`,
  async ({
    address,
    chain,
    version = LATEST_SWAP_PROXY_VERSION,
  }: {
    address: string;
    chain: ChainType;
    version?: string;
  }) => {
    const response = await getCompiledProxy({
      swap_creator: address,
      version: version,
      chain_type: chain,
    });

    const data = await response.data;
    const logicSig = getLogicSign(data[`result`]);

    const proxyAssets = await getAssetsForAccount(chain, address);
    const hasAwvt =
      proxyAssets.filter((asset) => asset[`index`] === AWVT_ASSET_INDEX(chain))
        .length > 0;

    return { proxy: logicSig, hasAwvt: hasAwvt };
  },
);

export const getAccountSwaps = createAsyncThunk(
  `walletConnect/getAccountSwaps`,
  async ({ chain, address }: { chain: ChainType; address: string }) => {
    return await getSwapConfigurationsForAccount(chain, address);
  },
);

export const optAssets = createAsyncThunk(
  `walletConnect/optAssets`,
  async (
    {
      assetIndexes,
      connector,
      deOptIn = false,
    }: { assetIndexes: number[]; connector: WalletManager; deOptIn?: boolean },
    { getState, dispatch },
  ) => {
    let state = getState() as any;
    state = state.walletConnect as WalletConnectState;

    return await optAssetsForAccount(
      state.chain,
      assetIndexes,
      connector,
      state.address,
      dispatch,
      deOptIn,
    );
  },
);

export const walletConnectSlice = createSlice({
  name: `walletConnect`,
  initialState,
  reducers: {
    switchChain(state, action: PayloadAction<ChainType>) {
      if (action.payload && state.chain !== action.payload) {
        state.chain = action.payload;
        state.selectedOfferingAssets = [];
        state.selectedRequestingAssets = [];
        state.swaps = [];

        if (typeof window !== `undefined`) {
          localStorage.setItem(`ChainType`, action.payload);
        }
      }
    },
    setOfferingAssets(state, action: PayloadAction<Asset[]>) {
      state.selectedOfferingAssets = action.payload;
    },
    setRequestingAssets(state, action: PayloadAction<Asset[]>) {
      state.selectedRequestingAssets = action.payload;
    },
    reset: (state) => ({ ...initialState, chain: state.chain }),
    onSessionUpdate: (state, action: PayloadAction<string[]>) => {
      state.accounts = action.payload;
      state.address = action.payload[0];
    },
  },
  extraReducers(builder) {
    builder.addCase(getAccountAssets.fulfilled, (state, action) => {
      state.fetching = false;
      state.assets = action.payload;
    });
    builder.addCase(getAccountAssets.pending, (state) => {
      state.fetching = true;
    });

    builder.addCase(getProxy.fulfilled, (state, action) => {
      state.fetching = false;
      state.proxy = action.payload.proxy;
      state.hasAwvt = action.payload.hasAwvt;
    });
    builder.addCase(getProxy.pending, (state) => {
      state.fetching = true;
    });

    builder.addCase(getAccountSwaps.fulfilled, (state, action) => {
      state.fetchingSwaps = false;
      state.swaps = action.payload;
    });
    builder.addCase(getAccountSwaps.pending, (state) => {
      state.fetchingSwaps = true;
    });
  },
});

export const selectAssets = createSelector(
  (state: RootState) => state.walletConnect.assets,
  (assets) => assets.map((a) => ({ ...a, amount: a.amount })),
);

export const selectOfferingAssets = createSelector(
  (state: RootState) => state.walletConnect.selectedOfferingAssets,
  (selectedOfferingAssets) =>
    [...selectedOfferingAssets].sort((a, b) => a.index - b.index),
);

export const selectOfferingAssetAmounts = createSelector(
  (state: RootState) => state.walletConnect.selectedOfferingAssets,
  (selectedOfferingAssets) =>
    Object.assign(
      {},
      ...selectedOfferingAssets.map((asset: Asset) => {
        return {
          [Number(asset.index)]: asset.offeringAmount,
        };
      }),
    ),
);

export const selectRequestingAssets = createSelector(
  (state: RootState) => state.walletConnect.selectedRequestingAssets,
  (selectedRequestingAssets) =>
    selectedRequestingAssets.sort((a, b) => a.index - b.index),
);

export const {
  switchChain,
  reset,
  onSessionUpdate,
  setOfferingAssets,
  setRequestingAssets,
} = walletConnectSlice.actions;

export default walletConnectSlice.reducer;
