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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import { TransactionToSignType } from '@/models/Transaction';
import WalletConnect from '@walletconnect/client';
import algosdk, { LogicSigAccount } from 'algosdk';
import getAccountInfo from '../accounts/getAccountInfo';
import createTransactionToSign from '../transactions/createTransactionToSign';
import getTransactionParams from '../transactions/getTransactionParams';

export default async function createSwapDepositTxns(
  chain: ChainType,
  creatorAddress: string,
  creatorWallet: WalletConnect,
  escrow: LogicSigAccount,
  offeringAssets: Asset[],
  fundingFee: number,
) {
  const suggestedParams = await getTransactionParams(chain);

  const txns = [];
  const escrowAccountInfo = await getAccountInfo(chain, escrow.address());

  const escrowBalance =
    escrowAccountInfo && `account` in escrowAccountInfo
      ? escrowAccountInfo.account.amount
      : 0;

  if (fundingFee > escrowBalance) {
    const feeTxn = createTransactionToSign(
      algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: creatorAddress,
        to: escrow.address(),
        amount: Math.abs(fundingFee - escrowBalance),
        note: new Uint8Array(
          Buffer.from(
            `I am a fee transaction for configuring algoworld swapper escrow min balance, thank you for using AlgoWorld Swapper :-)`,
          ),
        ),
        suggestedParams,
      }),
      creatorWallet,
      TransactionToSignType.UserFeeTransaction,
    );
    txns.push(feeTxn);
  }

  for (const asset of offeringAssets) {
    const depositTxn = createTransactionToSign(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: creatorAddress,
        to: escrow.address(),
        amount: asset.offeringAmount,
        assetIndex: asset.index,
        note: new Uint8Array(
          Buffer.from(
            `Transcation for the depositing asset ${
              asset.index
            } to swapper ${escrow.address()}, thank you for using AlgoWorld Swapper :-)`,
          ),
        ),
        suggestedParams,
      }),
      creatorWallet,
      TransactionToSignType.UserTransaction,
    );
    txns.push(depositTxn);
  }

  return txns;
}
