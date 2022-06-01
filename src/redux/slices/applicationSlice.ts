import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { SwapConfiguration } from '@/models/Swap';
import { LoadingIndicator } from '@/models/LoadingIndicator';

const initialState = {
  isWalletPopupOpen: false,
  isManageSwapPopupOpen: false,
  isShareSwapPopupOpen: false,
  loadingIndicator: {
    isLoading: false,
    message: undefined,
  } as LoadingIndicator,
  selectedManageSwap: undefined as SwapConfiguration | undefined,
  theme: `dark`,
};

export const applicationSlice = createSlice({
  name: `application`,
  initialState,
  reducers: {
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
});

export const {
  setIsWalletPopupOpen,
  setIsManageSwapPopupOpen,
  setIsShareSwapPopupOpen,
  setLoadingIndicator,
  setSelectedManageSwap,
  setTheme,
} = applicationSlice.actions;

export default applicationSlice.reducer;
