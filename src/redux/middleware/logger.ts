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

    if (action.type === `walletConnect/getProxy/pending`) {
      console.log(`loading proxy...`);
    }
    if (action.type === `walletConnect/getProxy/fulfilled`) {
      console.log(`proxy sucessfully loaded`);
    }

    if (action.type === `walletConnect/getAccountSwaps/pending`) {
      console.log(`loading swaps...`);
    }
    if (action.type === `walletConnect/getAccountSwaps/fulfilled`) {
      console.log(`swaps sucessfully loaded`);
    }

    const result = next(action);
    if (action.type === `walletConnect/reset`) {
      console.log(`reset state`, getState().walletConnect);
    }

    return result;
  };

export default logger;
