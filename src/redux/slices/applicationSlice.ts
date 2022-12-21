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
  createAsyncThunk,
  createSelector,
  createSlice,
  Draft,
  PayloadAction,
} from '@reduxjs/toolkit';
import { SwapConfiguration } from '@/models/Swap';
import { LoadingIndicator } from '@/models/LoadingIndicator';
import {
  EMPTY_ASSET_IMAGE_URL,
  CHAIN_TYPE,
  LATEST_SWAP_PROXY_VERSION,
  AWVT_ASSET_INDEX,
} from '@/common/constants';
import { ChainType } from '@/models/Chain';
import { IpfsGateway } from '@/models/Gateway';
import getAssetsForAccount from '@/utils/api/accounts/getAssetsForAccount';
import getLogicSign from '@/utils/api/accounts/getLogicSignature';
import getSwapConfigurationsForAccount from '@/utils/api/accounts/getSwapConfigurationsForAccount';
import optAssetsForAccount from '@/utils/api/accounts/optAssetsForAccount';
import recoverSwapConfigurationsForAccount from '@/utils/api/accounts/recoverSwapConfigurationsForAccount';
import getCompiledProxy from '@/utils/api/swaps/getCompiledProxy';
import { LogicSigAccount } from 'algosdk';
import { RootState } from '../store';
import { Asset } from '@/models/Asset';

interface ApplicationState {
  proxy: LogicSigAccount;
  assets: {
    index: number;
    amount: number;
    creator: string;
    frozen: boolean;
    decimals: number;
    offeringAmount: number;
    requestingAmount: number;
    imageUrl: string;
    name: string;
    unitName: string;
  }[];
  selectedOfferingAssets: Asset[];
  selectedRequestingAssets: Asset[];
  chain: ChainType;
  swaps: SwapConfiguration[];
  fetching: boolean;
  recoveringSwaps: boolean;
  recoveredSwaps: SwapConfiguration[];
  gateway: IpfsGateway;
  fetchingSwaps: boolean;
  hasAwvt: boolean;

  isWalletPopupOpen: boolean;
  isManageSwapPopupOpen: boolean;
  isShareSwapPopupOpen: boolean;
  isAboutPopupOpen: boolean;
  loadingIndicator: LoadingIndicator;
  selectedManageSwap: SwapConfiguration | undefined;
  theme: string;
}

const initialState: ApplicationState = {
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
      imageUrl: EMPTY_ASSET_IMAGE_URL(IpfsGateway.ALGONODE_IO),
      name: `Algo`,
      unitName: `Algo`,
    },
  ],
  selectedOfferingAssets: [],
  selectedRequestingAssets: [],
  chain: CHAIN_TYPE,
  swaps: [],
  fetching: false,
  recoveringSwaps: false,
  recoveredSwaps: [],
  gateway: IpfsGateway.ALGONODE_IO,
  fetchingSwaps: false,
  hasAwvt: false,

  isWalletPopupOpen: false,
  isManageSwapPopupOpen: false,
  isShareSwapPopupOpen: false,
  isAboutPopupOpen: false,
  loadingIndicator: {
    isLoading: false,
    message: undefined,
  } as LoadingIndicator,
  selectedManageSwap: undefined as SwapConfiguration | undefined,
  theme: `dark`,
};

export const getAccountAssets = createAsyncThunk(
  `application/getAccountAssets`,
  async ({
    chain,
    gateway,
    address,
  }: {
    chain: ChainType;
    gateway: IpfsGateway;
    address: string;
  }) => {
    return await getAssetsForAccount(chain, gateway, address);
  },
);

export const getProxy = createAsyncThunk(
  `application/getProxy`,
  async ({
    address,
    chain,
    gateway,
    version = LATEST_SWAP_PROXY_VERSION,
  }: {
    address: string;
    chain: ChainType;
    gateway: IpfsGateway;
    version?: string;
  }) => {
    const response = await getCompiledProxy({
      swap_creator: address,
      version: version,
      chain_type: chain,
    });

    const data = await response.data;
    const logicSig = getLogicSign(data[`result`]);

    const proxyAssets = await getAssetsForAccount(chain, gateway, address);
    const hasAwvt =
      proxyAssets.filter((asset) => asset[`index`] === AWVT_ASSET_INDEX(chain))
        .length > 0;

    return { proxy: logicSig, hasAwvt: hasAwvt };
  },
);

export const getAccountSwaps = createAsyncThunk(
  `application/getAccountSwaps`,
  async ({
    chain,
    gateway,
    address,
  }: {
    chain: ChainType;
    gateway: IpfsGateway;
    address: string;
  }) => {
    return await getSwapConfigurationsForAccount(chain, gateway, address);
  },
);

export const optAssets = createAsyncThunk(
  `application/optAssets`,
  async (
    {
      assetIndexes,
      gateway,
      chain,
      activeAddress,
      signTransactions,
      deOptIn = false,
    }: {
      assetIndexes: number[];
      gateway: IpfsGateway;
      chain: ChainType;
      activeAddress: string;
      signTransactions: (
        transactions: Array<Uint8Array>,
      ) => Promise<Uint8Array[]>;
      deOptIn?: boolean;
    },
    { dispatch },
  ) => {
    return await optAssetsForAccount(
      chain,
      gateway,
      assetIndexes,
      signTransactions,
      activeAddress,
      dispatch,
      deOptIn,
    );
  },
);

export const recoverSwapTxnHistory = createAsyncThunk(
  `application/recoverSwapTxnHistory`,
  async (
    {
      chain,
      gateway,
      activeAddress,
    }: {
      chain: ChainType;
      gateway: IpfsGateway;
      activeAddress: string;
    },
    {},
  ) => {
    return await recoverSwapConfigurationsForAccount(
      chain,
      gateway,
      activeAddress,
    );
  },
);

export const applicationSlice = createSlice({
  name: `application`,
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
    setGateway: (state, action: PayloadAction<IpfsGateway>) => {
      state.gateway = action.payload;

      if (typeof window !== `undefined`) {
        localStorage.setItem(`IpfsGateway`, action.payload);
      }
    },
    reset: (state) => ({ ...initialState, chain: state.chain }),

    setIsWalletPopupOpen: (state, action: PayloadAction<boolean>) => {
      state.isWalletPopupOpen = action.payload;
    },
    setLoadingIndicator: (state, action: PayloadAction<LoadingIndicator>) => {
      state.loadingIndicator = action.payload;
    },
    setIsManageSwapPopupOpen: (state, action: PayloadAction<boolean>) => {
      state.isManageSwapPopupOpen = action.payload;
    },
    setIsShareSwapPopupOpen: (state, action: PayloadAction<boolean>) => {
      state.isShareSwapPopupOpen = action.payload;
    },
    setIsAboutPopupOpen: (state, action: PayloadAction<boolean>) => {
      state.isAboutPopupOpen = action.payload;
    },
    setSelectedManageSwap: (
      state,
      action: PayloadAction<SwapConfiguration | undefined>,
    ) => {
      state.selectedManageSwap = action.payload;
    },
    setTheme: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState>,
    ) => {
      state.theme = action.payload.theme;
    },
  },
  extraReducers: (builder) => {
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
      state.swaps = action.payload as SwapConfiguration[];
    });
    builder.addCase(getAccountSwaps.pending, (state) => {
      state.fetchingSwaps = true;
    });

    builder.addCase(recoverSwapTxnHistory.fulfilled, (state, action) => {
      state.recoveringSwaps = false;
      state.recoveredSwaps = action.payload as SwapConfiguration[];
    });
    builder.addCase(recoverSwapTxnHistory.pending, (state) => {
      state.recoveringSwaps = true;
    });
  },
});

export const selectAssets = createSelector(
  (state: RootState) => state.application.assets,
  (assets) => assets.map((a) => ({ ...a, amount: a.amount })),
);

export const selectOfferingAssets = createSelector(
  (state: RootState) => state.application.selectedOfferingAssets,
  (selectedOfferingAssets) =>
    [...selectedOfferingAssets].sort((a, b) => a.index - b.index),
);

export const selectOfferingAssetAmounts = createSelector(
  (state: RootState) => state.application.selectedOfferingAssets,
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
  (state: RootState) => state.application.selectedRequestingAssets,
  (selectedRequestingAssets) =>
    selectedRequestingAssets.sort((a, b) => a.index - b.index),
);

export const {
  switchChain,
  setGateway,
  reset,
  setOfferingAssets,
  setRequestingAssets,
  setIsWalletPopupOpen,
  setIsManageSwapPopupOpen,
  setIsShareSwapPopupOpen,
  setIsAboutPopupOpen,
  setLoadingIndicator,
  setSelectedManageSwap,
  setTheme,
} = applicationSlice.actions;

export default applicationSlice.reducer;
