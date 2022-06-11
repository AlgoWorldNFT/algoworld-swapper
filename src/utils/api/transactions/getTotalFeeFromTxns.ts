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

export default function getTotalFeeFromTxns(txns: TransactionToSign[]) {
  let totalAlgoFee = 0;

  for (const txn of txns) {
    totalAlgoFee += txn.transaction.fee;

    if (
      (txn.type === TransactionToSignType.UserFeeTransaction ||
        txn.type === TransactionToSignType.LsigFeeTransaction) &&
      `amount` in txn.transaction
    ) {
      totalAlgoFee += Number(txn.transaction.amount);
    }
  }

  return totalAlgoFee;
}
