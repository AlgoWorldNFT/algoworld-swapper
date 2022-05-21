import {
  Dispatch,
  Middleware,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import { StoreGetSate } from '../store';

const logger: Middleware =
  ({ getState }: { getState: StoreGetSate }) =>
  (next: Dispatch) =>
  (action: PayloadAction<any, string, any, SerializedError>) => {
    if (action.type === `walletConnect/switchChain`) {
      console.log(`switch chain: `, action.payload);
    }
    if (action.type === `walletConnect/getAccountAssets/pending`) {
      console.log(`loading assets...`);
    }
    if (action.type === `walletConnect/getAccountAssets/fulfilled`) {
      console.log(`assets sucessfully loaded`);
    }
    if (action.type === `walletConnect/getAccountAssets/rejected`) {
      console.error(action.error.message);
    }

    const result = next(action);
    if (action.type === `walletConnect/reset`) {
      console.log(`reset state`, getState().walletConnect);
    }

    return result;
  };

export default logger;
