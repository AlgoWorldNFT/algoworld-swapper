import { configureStore } from '@reduxjs/toolkit';
import walletConnectReducer from '../slices/walletConnectSlice';
import applicationReducer from '../slices/applicationSlice';
import logger from '../middleware/logger';

const store = configureStore({
  reducer: {
    walletConnect: walletConnectReducer,
    application: applicationReducer,
  },
  preloadedState: {},
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type StoreGetSate = typeof store.getState;
export type RootState = ReturnType<StoreGetSate>;
export type AppDispatch = typeof store.dispatch;

export default store;
