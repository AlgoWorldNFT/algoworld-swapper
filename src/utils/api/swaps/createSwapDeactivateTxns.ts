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

import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import { TransactionToSignType } from '@/models/Transaction';
import algosdk, { LogicSigAccount } from 'algosdk';
import createTransactionToSign from '../transactions/createTransactionToSign';
import getTransactionParams from '../transactions/getTransactionParams';

export default async function createSwapDeactivateTxns(
  chain: ChainType,
  creatorAddress: string,
  escrow: LogicSigAccount,
  offeringAssets: Asset[],
) {
  const suggestedParams = await getTransactionParams(chain);

  const txns = [];

  for (const asset of offeringAssets) {
    const closeAsaTxn = createTransactionToSign(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: escrow.address(),
        to: creatorAddress,
        amount: 0,
        assetIndex: asset.index,
        closeRemainderTo: creatorAddress,
        note: new Uint8Array(
          Buffer.from(
            `I am a fee transaction for closing algoworld swapper escrow, thank you for using AlgoWorld Swapper 🙂`,
          ),
        ),
        suggestedParams,
      }),
      escrow,
      TransactionToSignType.LsigFeeTransaction,
    );
    txns.push(closeAsaTxn);
  }

  const closeSwapTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: escrow.address(),
      to: creatorAddress,
      amount: 0,
      closeRemainderTo: creatorAddress,
      note: new Uint8Array(
        Buffer.from(
          `Transaction for the closing algoworld swapper escrow, thank you for using AlgoWorld Swapper 🙂`,
        ),
      ),
      suggestedParams,
    }),
    escrow,
    TransactionToSignType.UserTransaction,
  );
  txns.push(closeSwapTxn);

  const proofTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: creatorAddress,
      to: creatorAddress,
      amount: 0,
      note: new Uint8Array(
        Buffer.from(
          `Transaction for the closing algoworld swapper escrow, thank you for using AlgoWorld Swapper 🙂`,
        ),
      ),
      suggestedParams,
    }),
    undefined,
    TransactionToSignType.UserTransaction,
  );
  txns.push(proofTxn);

  return txns;
}
