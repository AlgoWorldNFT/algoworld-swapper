import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import createInitSwapTxns from './createInitSwapTxns';

import { generateAccount } from 'algosdk';

import { LogicSigAccount, encodeAddress } from 'algosdk';
import getLogicSign from '../accounts/getLogicSignature';
import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';
import { dummyContract } from './__utils__/testUtils';

describe(`createInitSwapTxns`, () => {
  it(`generates txns correctly`, async () => {
    const dummyAccount = generateAccount();
    const dummyLogicSig = getLogicSign(dummyContract) as LogicSigAccount;
    const expectedAssetIndex = 123;
    const dummyOfferingAsset = {
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
    } as Asset;

    const expectedAmount = 12;
    const txns = await createInitSwapTxns(
      ChainType.TestNet,
      dummyAccount.addr,
      dummyLogicSig,
      expectedAmount,
      [dummyOfferingAsset],
    );

    // First txn
    expect((txns[0] as TransactionToSign).signer).toBe(undefined);
    expect((txns[0] as TransactionToSign).type).toBe(
      TransactionToSignType.UserFeeTransaction,
    );
    expect(
      encodeAddress((txns[0] as TransactionToSign).transaction.from.publicKey),
    ).toBe(dummyAccount.addr);
    expect(
      encodeAddress((txns[0] as TransactionToSign).transaction.to.publicKey),
    ).toBe(dummyLogicSig.address());
    expect((txns[0] as TransactionToSign).transaction.amount).toBe(
      expectedAmount,
    );

    // Second txn
    expect((txns[1] as TransactionToSign).signer).toBe(dummyLogicSig);
    expect((txns[1] as TransactionToSign).type).toBe(
      TransactionToSignType.LsigTransaction,
    );
    expect(
      encodeAddress((txns[1] as TransactionToSign).transaction.from.publicKey),
    ).toBe(dummyLogicSig.address());
    expect(
      encodeAddress((txns[1] as TransactionToSign).transaction.to.publicKey),
    ).toBe(dummyLogicSig.address());
    expect((txns[1] as TransactionToSign).transaction.assetIndex).toBe(
      expectedAssetIndex,
    );
  });
});
