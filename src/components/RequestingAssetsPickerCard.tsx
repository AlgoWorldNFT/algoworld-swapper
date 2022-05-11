import { ALGOEXPLORER_INDEXER_URL, axiosFetcher } from '@/common/api';
import { EMPTY_ASSET_IMAGE_URL } from '@/common/constants';
import { Asset, RequestingAsset } from '@/models/Asset';
import { RootContext } from '@/stores';
import { observer } from 'mobx-react-lite';
import { useContext, useMemo, useState } from 'react';
import useSWR from 'swr';
import AssetAmountPickerTable from './AssetAmountPickerTable';
import AssetPickerTable from './AssetPickerTable';

type Props = {
  cardTitle: string;
};

const RequestingAssetsPickerCard = observer(({ cardTitle }: Props) => {
  const store = useContext(RootContext);

  const [textInput, setTextInput] = useState(``);
  const [searchContent, setSearchContent] = useState(``);
  const [nextToken, setNextToken] = useState(``);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [hasSearchedAsset, setHasSearchedAsset] = useState(false);

  const searchAssetSearchParam = useMemo(() => {
    if (searchContent === ``) {
      return undefined;
    }
    const searchParam = !isNaN(Number(searchContent))
      ? `asset-id=${searchContent}`
      : `name=${searchContent}`;

    return `${ALGOEXPLORER_INDEXER_URL}/v2/assets?${searchParam}&limit=5${
      nextToken === `` ? `` : `&next=${nextToken}`
    }`;
  }, [nextToken, searchContent]);

  const { data, error } = useSWR(searchAssetSearchParam, axiosFetcher);

  const searchedAssets: Asset[] = useMemo(() => {
    if (error || !data) {
      return [];
    }

    setIsLoadingAssets(false);
    setHasSearchedAsset(true);

    return data.assets.map((rawAsset: any) => {
      const assetParams = rawAsset[`params`];
      return {
        index: rawAsset[`index`],
        name: assetParams.hasOwnProperty(`name`) ? assetParams[`name`] : ``,
        image_url: assetParams.hasOwnProperty(`url`)
          ? assetParams[`url`]
          : EMPTY_ASSET_IMAGE_URL,
        decimals: assetParams[`decimals`],
        unit_name: assetParams[`unit-name`],
        availableAmount: 0,
      } as Asset;
    });
  }, [data, error]);

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === undefined || e.target.value === ``) {
      setSearchContent(``);
    }
    setTextInput(e.target.value);
  };

  const onAssetSelected = (asset: Asset) => {
    store.addRequestingAssets({ ...asset, amount: 1 });
  };

  const onAssetDeselected = (asset: Asset) => {
    store.deleteRequestingAssets({ ...asset, amount: 0 });
  };

  const onSearchClicked = () => {
    setHasSearchedAsset(false);
    setIsLoadingAssets(true);
    setSearchContent(textInput);
    setNextToken(``);
  };

  const onAssetAmountIncreased = (asset: RequestingAsset) => {
    store.updateOfferingAssetAmount(asset, asset.amount + 1);
  };

  const onAssetAmountDecreased = (asset: RequestingAsset) => {
    store.updateOfferingAssetAmount(asset, asset.amount - 1);
  };

  return (
    <div className="rounded-lg shadow-xl  border-2  border-pink-700 focus:border-pink-700 hover:border-pink-600 transform transition-all">
      <div className="card w-96 bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-lg">
        <div className="text-pink-500 text-3xl text-center font-extrabold tracking-tight">
          {cardTitle}
        </div>
        <div className="mt-4">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                value={textInput}
                placeholder="Type to search..."
                disabled={isLoadingAssets}
                onChange={onSearchInputChange}
                className="input w-full outline-none focus:outline-none hover:outline-none outline-0"
              />
              <button
                className="btn btn-square"
                disabled={textInput === `` || isLoadingAssets}
                onClick={onSearchClicked}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {!isLoadingAssets &&
          hasSearchedAsset &&
          searchedAssets.length === 0 &&
          textInput !== `` ? (
            <div className="alert shadow-lg">
              <span>No results founds...</span>
            </div>
          ) : (
            <AssetPickerTable
              assets={searchedAssets}
              onDeselect={onAssetDeselected}
              onSelect={onAssetSelected}
              isOwner={false}
              isLoadingAssets={isLoadingAssets}
            />
          )}
          {store.requestingAssets.length > 0 && (
            <>
              <div className="animate-fade-in-up divider divider-vertical ">
                Selected assets
              </div>
              <div className="animate-fade-in-up grid flex-grow">
                <AssetAmountPickerTable
                  assets={store.requestingAssets}
                  onAssetAmountIncreased={onAssetAmountIncreased}
                  onAssetAmountDecreased={onAssetAmountDecreased}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default RequestingAssetsPickerCard;
