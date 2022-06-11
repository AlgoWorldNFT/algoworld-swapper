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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

export type StoreGetSate = typeof store.getState;
export type RootState = ReturnType<StoreGetSate>;
export type AppDispatch = typeof store.dispatch;

export default store;
