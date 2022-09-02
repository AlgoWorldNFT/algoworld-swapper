import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import createSaveSwapConfigTxns from './createSaveSwapConfigTxns';

import { generateAccount } from 'algosdk';

import { LogicSigAccount, encodeAddress } from 'algosdk';
import getLogicSign from '../accounts/getLogicSignature';
import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';
import { dummyContract } from './__utils__/testUtils';

describe(`createSaveSwapConfigTxns`, () => {
  it(`generates txns correctly`, async () => {
    const dummyAccount = generateAccount();
    const dummyLogicSig = getLogicSign(dummyContract) as LogicSigAccount;

    const fundingFee = 10_000;
    const dummyCid = `test`;
    const txns = await createSaveSwapConfigTxns(
      ChainType.TestNet,
      dummyAccount.addr,
      dummyLogicSig,
      fundingFee,
      dummyCid,
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
    expect((txns[0] as TransactionToSign).transaction.amount).toBe(fundingFee);

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
    expect(
      Buffer.from(
        (txns[1] as TransactionToSign).transaction.note as any,
        `base64`,
      ).toString(`utf8`),
    ).toBe(`ipfs://test`);
  });
});
