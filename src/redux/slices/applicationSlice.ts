import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isWalletPopupOpen: false,
  theme: `dark`,
};

export const applicationSlice = createSlice({
  name: `application`,
  initialState,
  reducers: {
    setIsWalletPopupOpen: (state, action: PayloadAction<boolean>) => {
      state.isWalletPopupOpen = action.payload;
    },
    setTheme: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState>,
    ) => {
      state.theme = action.payload.theme;
    },
  },
});

export const { setIsWalletPopupOpen, setTheme } = applicationSlice.actions;

export default applicationSlice.reducer;
