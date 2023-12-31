import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import createPerformSwapTxns from './createPerformSwapTxns';

import { generateAccount } from 'algosdk';

import { LogicSigAccount, encodeAddress } from 'algosdk';
import getLogicSign from '../accounts/getLogicSignature';
import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';
import { dummyContract, expectUserTxn } from './__utils__/testUtils';
import { SwapConfiguration, SwapType } from '@/models/Swap';
import { GET_INCENTIVE_FEE, INCENTIVE_WALLET } from '@/common/constants';

export function expectIncentivePayment(
  txn: TransactionToSign,
  from: string,
  version: string,
) {
  expect(txn.signer).toBe(undefined);
  expect(txn.type).toBe(TransactionToSignType.UserFeeTransaction);
  expect(txn.transaction.type).toBe(`pay`);
  expect(encodeAddress(txn.transaction.to.publicKey)).toBe(INCENTIVE_WALLET);
  expect(encodeAddress(txn.transaction.from.publicKey)).toBe(from);
  expect(txn.transaction.amount).toBe(GET_INCENTIVE_FEE(version));
}
function expectOfferedAsaXferTxn(
  txn: TransactionToSign,
  logicSig: LogicSigAccount,
  to: string,
  amount: number,
  assetIndex: number,
) {
  expect(txn.signer).toBe(logicSig);
  expect(txn.type).toBe(TransactionToSignType.LsigTransaction);
  expect(encodeAddress(txn.transaction.from.publicKey)).toBe(
    logicSig.address(),
  );
  expect(encodeAddress(txn.transaction.to.publicKey)).toBe(to);
  expect(txn.transaction.assetIndex).toBe(assetIndex);
  expect(txn.transaction.amount).toBe(amount);
}

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
    // Ensure length is correct
    expect(txns.length).toBe(3);

    // First txn - Offered ASA
    expectOfferedAsaXferTxn(
      txns[0],
      dummyLogicSig,
      dummyAccount.addr,
      0,
      expectedAssetIndex,
    );

    // Second txn - Requested ASA
    expectUserTxn(
      txns[1],
      dummyAccount.addr,
      dummyAccount.addr,
      expectedAssetIndex,
    );

    // Third txn - Incentive payment
    expectIncentivePayment(txns[2], dummyAccount.addr, dummySwapVersion);
  });
  it(`generates Multi ASA to ALGO txns correctly`, async () => {
    const dummyAccount = generateAccount();
    const dummyLogicSig = getLogicSign(dummyContract) as LogicSigAccount;
    const expectedAssetIndex = 123;
    const expectedSecondAssetIndex = 1234;
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
    const secondDummyOfferingAsset = {
      index: expectedSecondAssetIndex,
      creator: `test`,
      name: `test`,
      imageUrl: `test`,
      decimals: 6,
      unitName: `test`,
      amount: 10,
      frozen: false,
      offeringAmount: 0,
      requestingAmount: 0,
    } as Asset;
    const dummySwapVersion = `0.0.2`;
    const dummySwapConfiguration = {
      version: dummySwapVersion,
      type: SwapType.MULTI_ASA_TO_ALGO,
      offering: [dummyOfferingAsset, secondDummyOfferingAsset],
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

    // Ensure length is correct
    expect(txns.length).toBe(4);

    // First txn - Incentive Fee
    expectIncentivePayment(txns[0], dummyAccount.addr, dummySwapVersion);

    // Second txn - Request Algo Payment
    expectUserTxn(txns[1], dummyAccount.addr, dummyAccount.addr);

    // Third txn - Assets Transfer
    expectOfferedAsaXferTxn(
      txns[2],
      dummyLogicSig,
      dummyAccount.addr,
      0,
      expectedAssetIndex,
    );

    // Fourth txn - Assets Transfer
    expectOfferedAsaXferTxn(
      txns[3],
      dummyLogicSig,
      dummyAccount.addr,
      0,
      expectedSecondAssetIndex,
    );
  });
});
