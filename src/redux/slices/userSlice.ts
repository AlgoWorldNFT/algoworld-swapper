import { Asset } from '@/models/Asset';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadOwningAssets } from '@/utils/assets';

const initialState = {
  owningAssets: [] as Asset[],
  walletClient: undefined as any | undefined,
  walletAddress: undefined as string | undefined,
  selectedOfferingAssets: [] as Asset[],
  selectedRequestingAssets: [] as Asset[],
} as const;

export const loadUserAssets = createAsyncThunk(
  `user/lookupUserAssets`,
  loadOwningAssets,
);

export const userSlice = createSlice({
  name: `user`,
  initialState,
  reducers: {
    setWalletClient: (state, action: PayloadAction<any>) => {
      state.walletClient = action.payload;
    },

    logoutWalletClient: (state) => {
      if (state.walletClient && state.walletClient?.connector?.connected) {
        state.walletClient.disconnect();
        state.walletAddress = undefined;
        // state.walletClient = ();
      }
    },

    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.walletAddress = action.payload;
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
  extraReducers: (builder) => {
    builder.addCase(loadUserAssets.fulfilled, (state, action) => {
      Object.assign(state.owningAssets, action.payload);
    });
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
