import { Asset } from '@/models/Asset';
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  owningAssets: [
    {
      index: 12345,
      name: `AW Card #1`,
      decimals: 0,
      unitName: `CARD`,
      amount: 0,
      offeringAmount: 0,
      requestingAmount: 0,
      imageUrl: `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`,
    },
    {
      index: 12255,
      name: `AW Card #2`,
      decimals: 0,
      unitName: `CARD`,
      amount: 2,
      offeringAmount: 0,
      requestingAmount: 0,
      imageUrl: `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`,
    },
    {
      index: 12255,
      name: `AW Card #2`,
      decimals: 0,
      unitName: `CARD`,
      amount: 2,
      offeringAmount: 0,
      requestingAmount: 0,
      imageUrl: `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`,
    },
    {
      index: 12255,
      name: `AW Card #2`,
      decimals: 0,
      unitName: `CARD`,
      amount: 2,
      offeringAmount: 0,
      requestingAmount: 0,
      imageUrl: `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`,
    },
    {
      index: 12255,
      name: `AW Card #2`,
      decimals: 0,
      unitName: `CARD`,
      amount: 2,
      offeringAmount: 0,
      requestingAmount: 0,
      imageUrl: `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`,
    },
  ] as Asset[],
  selectedOfferingAssets: [] as Asset[],
  selectedRequestingAssets: [] as Asset[],
} as const;

export const userSlice = createSlice({
  name: `user`,
  initialState,
  reducers: {
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
  setOfferingAssets,
  setOwningAssets,
  setRequestingAssets,
  resetOwningAssets,
  resetOfferingAssets,
  resetRequestingAssets,
} = userSlice.actions;

export default userSlice.reducer;
