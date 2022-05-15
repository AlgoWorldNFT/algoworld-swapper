import { Asset } from '@/models/Asset';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PeraWalletConnect } from '@perawallet/connect';
import { loadOwningAssets } from '@/utils/loadOwningAssets';

const initialState = {
  owningAssets: [] as Asset[],
  walletClient: undefined as PeraWalletConnect | undefined,
  walletAddress: undefined as string | undefined,
  selectedOfferingAssets: [] as Asset[],
  selectedRequestingAssets: [] as Asset[],
} as const;

export const userSlice = createSlice({
  name: `user`,
  initialState,
  reducers: {
    setWalletClient: (state, action: PayloadAction<PeraWalletConnect>) => {
      state.walletClient = action.payload;
    },

    logoutWalletClient: (state) => {
      if (state.walletClient) {
        state.walletClient.disconnect();
      }

      state.walletAddress = undefined;
    },

    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.walletAddress = action.payload;

      state.owningAssets = loadOwningAssets(state.walletAddress);
    },

    setOwningAssets: (state, action: PayloadAction<Asset[]>) => {
      state.owningAssets = action.payload;
    },

    resetOwningAssets: (state) => {
      state.owningAssets = [];
    },

    setOfferingAssets: (state, action: PayloadAction<Asset[]>) => {
      state.selectedOfferingAssets = action.payload;
    },

    resetOfferingAssets: (state) => {
      state.selectedOfferingAssets = [];
    },

    setRequestingAssets: (state, action: PayloadAction<Asset[]>) => {
      state.selectedRequestingAssets = action.payload;
    },

    resetRequestingAssets: (state) => {
      state.selectedRequestingAssets = [];
    },
  },
});

// Selectors
export const getOwningAssets = (state: { owningAssets: any }) =>
  state.owningAssets;

// Reducers and actions
export const {
  setWalletAddress,
  setWalletClient,
  logoutWalletClient,
  setOfferingAssets,
  setOwningAssets,
  setRequestingAssets,
  resetOwningAssets,
  resetOfferingAssets,
  resetRequestingAssets,
} = userSlice.actions;

export default userSlice.reducer;
