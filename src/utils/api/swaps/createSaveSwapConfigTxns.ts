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
import algosdk, { LogicSigAccount } from 'algosdk';
import createTransactionToSign from '../transactions/createTransactionToSign';
import getTransactionParams from '../transactions/getTransactionParams';

export default async function createSaveSwapConfigTxns(
  chain: ChainType,
  creatorAddress: string,
  proxyLsig: LogicSigAccount,
  fundingFee: number,
  swapConfigurationCID: string,
) {
  const suggestedParams = await getTransactionParams(chain);

  const rawFeeTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: creatorAddress,
    to: proxyLsig.address(),
    amount: fundingFee,
    note: new Uint8Array(
      Buffer.from(
        `I am a fee transaction for configuring algoworld swapper proxy, thank you for using AlgoWorld Swapper :-)`,
      ),
    ),
    suggestedParams,
  });
  rawFeeTxn.flatFee = true;
  rawFeeTxn.fee = 1_000 * 2; // covers both user signed and escrow signed txns fee

  const feeTxn = createTransactionToSign(
    rawFeeTxn,
    undefined,
    TransactionToSignType.UserFeeTransaction,
  );

  const rawStoreTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: proxyLsig.address(),
    to: proxyLsig.address(),
    amount: 0,
    note: new Uint8Array(Buffer.from(`ipfs://${swapConfigurationCID}`)),
    suggestedParams: { ...suggestedParams, fee: 0 },
  });
  rawStoreTxn.fee = 0;

  const storeTxn = createTransactionToSign(
    rawStoreTxn,
    proxyLsig,
    TransactionToSignType.LsigTransaction,
  );

  return [feeTxn, storeTxn];
}
