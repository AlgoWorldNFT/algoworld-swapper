import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import createSwapDepositTxns from './createSwapDepositTxns';

import { encodeAddress, generateAccount, LogicSigAccount } from 'algosdk';
import getLogicSign from '../accounts/getLogicSignature';
import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';
import { dummyContract, expectUserTxn } from './__utils__/testUtils';
import { ASA_TO_ASA_FUNDING_FEE } from '@/common/constants';
import getAccountInfo from '@/utils/api/accounts/getAccountInfo';

async function expectUserFeeTransaction(
  txn: TransactionToSign,
  from: string,
  to: string,
  fundingFee: number,
) {
  const escrowAccountInfo = await getAccountInfo(ChainType.TestNet, to);

  const escrowBalance =
    escrowAccountInfo && `account` in escrowAccountInfo
      ? escrowAccountInfo.account.amount
      : 0;
  expect(txn.signer).toBe(undefined);
  expect(txn.type).toBe(TransactionToSignType.UserFeeTransaction);
  expect(encodeAddress(txn.transaction.from.publicKey)).toBe(from);
  expect(encodeAddress(txn.transaction.to.publicKey)).toBe(to);
  expect(txn.transaction.amount).toBe(Math.abs(fundingFee - escrowBalance));
}

describe(`createSwapDepositTxns`, () => {
  it(`generates swap deposit txns`, async () => {
    const dummyAccount = generateAccount();
    const dummyLogicSig = getLogicSign(dummyContract) as LogicSigAccount;
    const expectedAssetIndex = 123;
    const dummyAssets: Asset[] = [
      {
        index: expectedAssetIndex,
        creator: `test`,
        name: `test`,
        imageUrl: `test`,
        decimals: 6,
        unitName: `test`,
        amount: 1,
        frozen: false,
        offeringAmount: 0,
        requestingAmount: 0,
      },
    ];
    const txns = await createSwapDepositTxns(
      ChainType.TestNet,
      dummyAccount.addr,
      dummyLogicSig,
      dummyAssets,
      ASA_TO_ASA_FUNDING_FEE + 20,
    );
    // Ensure length is correct
    expect(txns.length).toBe(2);
    await expectUserFeeTransaction(
      txns[0],
      dummyAccount.addr,
      dummyLogicSig.address(),
      ASA_TO_ASA_FUNDING_FEE + 20,
    );

    expectUserTxn(
      txns[1],
      dummyAccount.addr,
      dummyLogicSig.address(),
      dummyAssets[0].index,
    );
  });
});
