import { ChainType } from '@/models/Chain';
import { IpfsGateway } from '@/models/Gateway';
import { setLoadingIndicator } from '@/redux/slices/applicationSlice';
import { generateAccount } from 'algosdk';
import optAssetsForAccount from './optAssetsForAccount';

describe(`optAssetsForAccount`, () => {
  it(`should opt in to the provided asset indexes`, async () => {
    const chain: ChainType = ChainType.TestNet;
    const gateway: IpfsGateway = IpfsGateway.ALGONODE_IO;
    const assetIndexes: number[] = [1, 2, 3];
    const signTransactions = () => Promise.resolve([]);
    const account = generateAccount();
    const creatorAddress = account.addr;
    const dispatch = jest.fn();

    await optAssetsForAccount(
      chain,
      gateway,
      assetIndexes,
      signTransactions,
      creatorAddress,
      dispatch,
    );

    expect(dispatch).toHaveBeenCalledWith(
      setLoadingIndicator({
        isLoading: true,
        message: `Creating opt-in transactions...`,
      }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setLoadingIndicator({
        isLoading: true,
        message: `Signing transactions...`,
      }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setLoadingIndicator({
        isLoading: true,
        message: `Submitting opt-in transactions, please wait...`,
      }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setLoadingIndicator({
        isLoading: false,
        message: undefined,
      }),
    );
  });
});
