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

import { ChainType } from '@/models/Chain';
import { TransactionToSignType } from '@/models/Transaction';
import algosdk from 'algosdk';
import createTransactionToSign from '@/utils/api/transactions/createTransactionToSign';
import getTransactionParams from '@/utils/api/transactions/getTransactionParams';
import submitTransactions from '@/utils/api/transactions/submitTransactions';

import { setLoadingIndicator } from '@/redux/slices/applicationSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { getAccountAssets } from '@/redux/slices/walletConnectSlice';
import WalletManager from '@/utils/wallets/walletManager';

export default async function optInAssets(
  chain: ChainType,
  assetIndexes: number[],
  creatorWallet: WalletManager,
  creatorAddress: string,
  dispatch: Dispatch,
) {
  const optInTxns = [];
  const suggestedParams = await getTransactionParams(chain);

  dispatch(
    setLoadingIndicator({
      isLoading: true,
      message: `Creating opt-in transactions...`,
    }),
  );

  for (const index of assetIndexes) {
    optInTxns.push(
      createTransactionToSign(
        algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: creatorAddress,
          to: creatorAddress,
          amount: 0,
          assetIndex: index,
          note: new Uint8Array(
            Buffer.from(
              ` I am an asset opt-in transaction for algoworld swapper escrow, thank you for using AlgoWorld Swapper (☞ ͡° ͜ʖ ͡°)☞`,
            ),
          ),
          suggestedParams,
        }),
        undefined,
        TransactionToSignType.UserTransaction,
      ),
    );
  }

  dispatch(
    setLoadingIndicator({
      isLoading: true,
      message: `Signing transactions...`,
    }),
  );

  const signedSaveSwapConfigTxns = await creatorWallet
    .signTransactions(optInTxns)
    .catch(() => {
      dispatch(setLoadingIndicator({ isLoading: false, message: undefined }));
      return undefined;
    });

  if (!signedSaveSwapConfigTxns) {
    dispatch(setLoadingIndicator({ isLoading: false, message: undefined }));
    return undefined;
  }

  dispatch(
    setLoadingIndicator({
      isLoading: true,
      message: `Submitting opt-in transactions, please wait...`,
    }),
  );

  const saveSwapConfigResponse = await submitTransactions(
    chain,
    signedSaveSwapConfigTxns,
  );

  dispatch(setLoadingIndicator({ isLoading: false, message: undefined }));

  // Makes sure to reload assets after opt-in
  dispatch(getAccountAssets({ chain, address: creatorAddress }) as any);

  return saveSwapConfigResponse.txId;
}
