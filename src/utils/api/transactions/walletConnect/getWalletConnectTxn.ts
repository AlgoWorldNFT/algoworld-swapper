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
