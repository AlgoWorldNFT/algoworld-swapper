import { TransactionToSign, TransactionToSignType } from '@/models/Transaction';
import { encodeAddress } from 'algosdk';

export const dummyContract = `BiAH6AcBBJmH0wcDAGQmASB6zQMKOJBtxFB4ILNYiiRQngRy5XJoFC96k36qJavhHDIEgQISMwAQIxIQMwEQJBIQQAENMgQhBBIzABAkEhAzARAkEhAzAhAjEhBAAG8yBCEEEjMAECQSEDMBECMSEDMCECMSEEAAAQAzAAEiDjMAIDIDEhAzABMyAxIQMwEBIg4zASAyAxIQEDMAESUSEDMAFCgSEDMAFSgSEDMBBygSEDMBCSgSEDMCACgSEDMCBygSEDMCCCEFEhBCAN4zAAEiDjMAIDIDEhAzABMyAxIQMwAVMgMSEDMBEzIDEhAzABElEhAzABIhBhIQMwERJRIQMwESIQYSEDMAFDMBABIQMwEUKBIQMwIHgCCKaxNJ5pPcb9t1+hmc6CDAgBtvAussZRHPAQiO5V1OjRIQMwIAMwEAEhAzAgiBoMIeEhBCAFozAAEiDjMAIDIDEhAzAAkyAxIQMwEBIg4zASAyAxIQMwETMgMSEDMBFTIDEhAQMwAAKBIQMwAHMwEAEhAzAAiB0OgMDxAzARElEhAzAQAzARQSEDMBEiEFEhBD`;
export function expectUserTxn(
  txn: TransactionToSign,
  from: string,
  to: string,
  assetIndex?: number,
) {
  expect(txn.signer).toBe(undefined);
  expect(txn.type).toBe(TransactionToSignType.UserTransaction);
  expect(encodeAddress(txn.transaction.from.publicKey)).toBe(from);
  expect(encodeAddress(txn.transaction.to.publicKey)).toBe(to);
  if (typeof assetIndex !== `undefined`) {
    expect(txn.transaction.assetIndex).toBe(assetIndex);
  }
}
