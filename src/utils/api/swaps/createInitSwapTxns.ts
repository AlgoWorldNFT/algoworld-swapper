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

export default async function createInitSwapTxns(
  chain: ChainType,
  creatorAddress: string,
  escrowLsig: LogicSigAccount,
  fundingFee: number,
  offeringAssets: Asset[],
) {
  const suggestedParams = await getTransactionParams(chain);

  const txns = [];

  const feeTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: creatorAddress,
      to: escrowLsig.address(),
      amount: fundingFee,
      note: new Uint8Array(
        Buffer.from(
          `I am a fee transaction for configuring algoworld swapper escrow, thank you for using AlgoWorld Swapper 🙂`,
        ),
      ),
      suggestedParams,
    }),
    undefined, // TODO: refactor
    TransactionToSignType.UserFeeTransaction,
  );

  txns.push(feeTxn);

  for (const asset of offeringAssets) {
    const nftTxn = createTransactionToSign(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: escrowLsig.address(),
        to: escrowLsig.address(),
        amount: 0,
        assetIndex: Number(asset.index),
        note: new Uint8Array(
          Buffer.from(
            ` I am an asset opt-in transaction for algoworld swapper escrow, thank you for using AlgoWorld Swapper 🙂`,
          ),
        ),
        suggestedParams,
      }),
      escrowLsig,
      TransactionToSignType.LsigTransaction,
    );
    txns.push(nftTxn);
  }

  return txns;
}
