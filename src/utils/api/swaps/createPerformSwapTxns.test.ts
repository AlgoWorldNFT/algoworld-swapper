import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import createPerformSwapTxns from './createPerformSwapTxns';

import { generateAccount } from 'algosdk';

import { LogicSigAccount, encodeAddress } from 'algosdk';
import getLogicSign from '../accounts/getLogicSignature';
import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';
import { dummyContract } from './__utils__/testUtils';
import { SwapConfiguration, SwapType } from '@/models/Swap';
import { GET_INCENTIVE_FEE, INCENTIVE_WALLET } from '@/common/constants';

describe(`createPerformSwapTxns`, () => {
  it(`generates asa to asa txns correctly`, async () => {
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
    const dummySwapVersion = `0.0.2`;
    const dummySwapConfiguration = {
      version: dummySwapVersion,
      type: SwapType.ASA_TO_ASA,
      offering: [dummyOfferingAsset],
      requesting: [dummyOfferingAsset],
      creator: dummyAccount.addr,
      proxy: dummyLogicSig.address(),
      escrow: dummyLogicSig.address(),
      contract: dummyContract,
    } as SwapConfiguration;

    const txns = await createPerformSwapTxns(
      ChainType.TestNet,
      dummyAccount.addr,
      dummyLogicSig,
      dummySwapConfiguration,
    );

    // First txn
    expect((txns[0] as TransactionToSign).signer).toBe(dummyLogicSig);
    expect((txns[0] as TransactionToSign).type).toBe(
      TransactionToSignType.LsigTransaction,
    );
    expect(
      encodeAddress((txns[0] as TransactionToSign).transaction.from.publicKey),
    ).toBe(dummyLogicSig.address());
    expect(
      encodeAddress((txns[0] as TransactionToSign).transaction.to.publicKey),
    ).toBe(dummyAccount.addr);
    expect((txns[0] as TransactionToSign).transaction.assetIndex).toBe(
      expectedAssetIndex,
    );
    expect((txns[0] as TransactionToSign).transaction.amount).toBe(0);

    // Second txn
    expect((txns[1] as TransactionToSign).signer).toBe(undefined);
    expect((txns[1] as TransactionToSign).type).toBe(
      TransactionToSignType.UserTransaction,
    );
    expect(
      encodeAddress((txns[1] as TransactionToSign).transaction.from.publicKey),
    ).toBe(dummyAccount.addr);
    expect(
      encodeAddress((txns[1] as TransactionToSign).transaction.to.publicKey),
    ).toBe(dummyAccount.addr);
    expect((txns[1] as TransactionToSign).transaction.assetIndex).toBe(
      expectedAssetIndex,
    );

    // Third txn
    expect((txns[2] as TransactionToSign).signer).toBe(undefined);
    expect((txns[2] as TransactionToSign).type).toBe(
      TransactionToSignType.UserFeeTransaction,
    );
    expect(
      encodeAddress((txns[2] as TransactionToSign).transaction.from.publicKey),
    ).toBe(dummyAccount.addr);
    expect(
      encodeAddress((txns[2] as TransactionToSign).transaction.to.publicKey),
    ).toBe(INCENTIVE_WALLET);
    expect((txns[2] as TransactionToSign).transaction.amount).toBe(
      GET_INCENTIVE_FEE(dummySwapVersion),
    );
  });
});
