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

import { GET_INCENTIVE_FEE, INCENTIVE_WALLET } from '@/common/constants';
import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import { SwapConfiguration, SwapType } from '@/models/Swap';
import { TransactionToSignType } from '@/models/Transaction';
import algosdk, { LogicSigAccount } from 'algosdk';
import createTransactionToSign from '../transactions/createTransactionToSign';
import getTransactionParams from '../transactions/getTransactionParams';

async function createAsaToAsaSwapPerformTxns(
  chain: ChainType,
  userAddress: string,
  creatorAddress: string,
  escrowLsig: LogicSigAccount,
  offering: Asset,
  requesting: Asset,
  version: string,
) {
  const suggestedParams = await getTransactionParams(chain);

  const note = `I am a asset transfer transaction to perform swap. thank you for using AlgoWorld Swapper! 🙂`;

  const txns = [];

  const offeredAsaXferTxn = createTransactionToSign(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: escrowLsig.address(),
      to: userAddress,
      amount: offering.offeringAmount,
      assetIndex: offering.index,
      note: new Uint8Array(Buffer.from(note)),
      suggestedParams,
    }),
    escrowLsig,
    TransactionToSignType.LsigTransaction,
  );

  txns.push(offeredAsaXferTxn);

  const requestedAsaXferTxn = createTransactionToSign(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: userAddress,
      to: creatorAddress,
      amount: requesting.requestingAmount,
      assetIndex: requesting.index,
      note: new Uint8Array(Buffer.from(note)),
      suggestedParams,
    }),
    undefined,
    TransactionToSignType.UserTransaction,
  );
  txns.push(requestedAsaXferTxn);

  const incentiveFeeTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: userAddress,
      to: INCENTIVE_WALLET,
      amount: GET_INCENTIVE_FEE(version),
      note: new Uint8Array(Buffer.from(note)),
      suggestedParams,
    }),
    undefined,
    TransactionToSignType.UserFeeTransaction,
  );
  txns.push(incentiveFeeTxn);

  return txns;
}

async function createAsasToAlgoSwapPerformTxns(
  chain: ChainType,
  userAddress: string,
  creatorAddress: string,
  escrowLsig: LogicSigAccount,
  offering: Asset[],
  requestingAlgoAmount: number,
  version: string,
) {
  const suggestedParams = await getTransactionParams(chain);

  const note = `I am a asset transfer transaction to perform swap. thank you for using AlgoWorld Swapper! 🙂`;
  const txns = [];

  const incentiveFeeTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: userAddress,
      to: INCENTIVE_WALLET,
      amount: GET_INCENTIVE_FEE(version),
      note: new Uint8Array(Buffer.from(note)),
      suggestedParams,
    }),
    undefined,
    TransactionToSignType.UserFeeTransaction,
  );
  txns.push(incentiveFeeTxn);

  const requestedAlgoTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: userAddress,
      to: creatorAddress,
      amount: requestingAlgoAmount,
      note: new Uint8Array(Buffer.from(note)),
      suggestedParams,
    }),
    undefined,
    TransactionToSignType.UserTransaction,
  );
  txns.push(requestedAlgoTxn);

  for (const asset of offering) {
    const offeredAsaXferTxn = createTransactionToSign(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: escrowLsig.address(),
        to: userAddress,
        amount: asset.offeringAmount,
        assetIndex: asset.index,
        note: new Uint8Array(Buffer.from(note)),
        suggestedParams,
      }),
      escrowLsig,
      TransactionToSignType.LsigTransaction,
    );

    txns.push(offeredAsaXferTxn);
  }

  return txns;
}

export default async function createPerformSwapTxns(
  chain: ChainType,
  userAddress: string,
  escrowLsig: LogicSigAccount,
  swapConfiguration: SwapConfiguration,
) {
  const txns =
    swapConfiguration.type === SwapType.ASA_TO_ASA
      ? await createAsaToAsaSwapPerformTxns(
          chain,
          userAddress,
          swapConfiguration.creator,
          escrowLsig,
          swapConfiguration.offering[0],
          swapConfiguration.requesting[0],
          swapConfiguration.version,
        )
      : await createAsasToAlgoSwapPerformTxns(
          chain,
          userAddress,
          swapConfiguration.creator,
          escrowLsig,
          swapConfiguration.offering,
          swapConfiguration.requesting[0].requestingAmount,
          swapConfiguration.version,
        );

  return txns;
}
