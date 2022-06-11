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

import algosdk, { Transaction } from 'algosdk';

export default function getWalletConnectTxn(txn: Transaction, sign: boolean) {
  const encodedTxn = Buffer.from(
    algosdk.encodeUnsignedTransaction(txn),
  ).toString(`base64`);

  return {
    txn: encodedTxn,
    message: `Sign transaction to proceed`,
    // Note: if the transaction does not need to be signed (because it's part of an atomic group
    // that will be signed by another party), specify an empty singers array like so:
    signers: sign ? undefined : [],
  };
}
