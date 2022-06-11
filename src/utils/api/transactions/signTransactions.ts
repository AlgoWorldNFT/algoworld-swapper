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

import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';
import { formatJsonRpcRequest } from '@json-rpc-tools/utils';
import WalletConnect from '@walletconnect/client';
import {
  assignGroupID,
  LogicSigAccount,
  signLogicSigTransactionObject,
} from 'algosdk';
import getWalletConnectTxn from './walletConnect/getWalletConnectTxn';

export default async function signTransactions(
  transactions: TransactionToSign[],
  userWallet: WalletConnect,
) {
  const rawTxns = [...transactions.map((txn) => txn.transaction)];
  const txnGroup = assignGroupID(rawTxns);

  const userRequest = formatJsonRpcRequest(`algo_signTxn`, [
    txnGroup.map((value, index) => {
      if (
        transactions[index].type === TransactionToSignType.UserTransaction ||
        transactions[index].type === TransactionToSignType.UserFeeTransaction
      ) {
        return getWalletConnectTxn(value, true);
      } else {
        return getWalletConnectTxn(value, false);
      }
    }),
  ]);
  const signedUserTransactionsResult = await userWallet.sendCustomRequest(
    userRequest,
  );

  const signedUserTransactions: (Uint8Array | null)[] =
    signedUserTransactionsResult.map((element: string) => {
      return element ? new Uint8Array(Buffer.from(element, `base64`)) : null;
    });

  const signedTxs = signedUserTransactions.map((signedTx, index) => {
    if (signedTx === null) {
      const signedEscrowTx = signLogicSigTransactionObject(
        txnGroup[index],
        transactions[index].signer as LogicSigAccount,
      );

      return signedEscrowTx.blob;
    } else {
      return signedTx;
    }
  }) as Uint8Array[];

  return signedTxs;
}
