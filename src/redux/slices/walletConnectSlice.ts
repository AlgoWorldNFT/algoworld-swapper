import { EMPTY_ASSET_IMAGE_URL } from '@/common/constants';
import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import { SwapConfiguration } from '@/models/Swap';
import getAssetsForAccount from '@/utils/api/accounts/getAssetsForAccount';
import loadSwapConfigurations from '@/utils/api/swaps/loadSwapConfigurations';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { LogicSigAccount } from 'algosdk';
import { RootState } from '../store';

interface WalletConnectState {
  chain: ChainType;
  accounts: string[];
  address: string;
  assets: Asset[];
  fetching: boolean;
  swaps: SwapConfiguration[];
  selectedOfferingAssets: Asset[];
  selectedRequestingAssets: Asset[];
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
  chain: ChainType.TestNet,
  swaps: [],
  fetching: false,
} as WalletConnectState;

export const getAccountAssets = createAsyncThunk(
  `walletConnect/getAccountAssets`,
  async ({ chain, address }: { chain: ChainType; address: string }) => {
    return await getAssetsForAccount(chain, address);
  },
);

export const getAccountSwaps = createAsyncThunk(
  `walletConnect/getAccountSwaps`,
  async ({ chain, address }: { chain: ChainType; address: string }) => {
    return await loadSwapConfigurations(chain, address);
  },
);

export const walletConnectSlice = createSlice({
  name: `walletConnect`,
  initialState,
  reducers: {
    switchChain(state, action: PayloadAction<ChainType>) {
      state.chain = action.payload;
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

    builder.addCase(getAccountSwaps.fulfilled, (state, action) => {
      state.fetching = false;
      state.swaps = action.payload;
    });
    builder.addCase(getAccountSwaps.pending, (state) => {
      state.fetching = true;
    });
  },
});

export const selectAssets = createSelector(
  (state: RootState) => state.walletConnect.assets,
  (assets) => assets.map((a) => ({ ...a, amount: a.amount })),
);

export const {
  switchChain,
  reset,
  onSessionUpdate,
  setOfferingAssets,
  setRequestingAssets,
} = walletConnectSlice.actions;

export default walletConnectSlice.reducer;
