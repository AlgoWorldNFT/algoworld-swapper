import { ALGOEXPLORER_INDEXER_URL, axiosFetcher } from '@/common/api';
import { EMPTY_ASSET_IMAGE_URL } from '@/common/constants';
import { Asset } from '@/models/Asset';
import { RootContext } from '@/stores';
import { useContext, useMemo, useState } from 'react';
import useSWR from 'swr';
import AssetAmountPickerTable from './AssetAmountPickerTable';
import AssetPickerTable from './AssetPickerTable';

type Props = {
  cardTitle: string;
};

const RequestingAssetsPickerCard = ({ cardTitle }: Props) => {
  const store = useContext(RootContext);

  const [textInput, setTextInput] = useState(``);
  const [searchContent, setSearchContent] = useState(``);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  const searchAssetSearchParam = useMemo(() => {
    if (searchContent === ``) {
      return undefined;
    }
    const searchParam = !isNaN(Number(searchContent))
      ? `asset-id=${searchContent}`
      : `name=${searchContent}`;

    return `${ALGOEXPLORER_INDEXER_URL}/v2/assets?${searchParam}&limit=35`;
  }, [searchContent]);

  const { data, error } = useSWR(searchAssetSearchParam, axiosFetcher);

  const searchedAssets: Asset[] = useMemo(() => {
    if (error || !data) {
      return [];
    }

    setIsLoadingAssets(false);

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
        amount: 0,
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
    store.setOwningAssets([
      ...store.owningAssets.filter(
        (curAsset) => asset.index !== curAsset.index,
      ),
      { ...asset, amount: 1 },
    ]);
    store.setOfferingAssets([...store.offeringAssets, { ...asset, amount: 1 }]);
  };

  const onAssetDeselected = (asset: Asset) => {
    store.setOwningAssets([
      ...store.owningAssets.filter(
        (curAsset) => asset.index !== curAsset.index,
      ),
      { ...asset, amount: 0 },
    ]);
    store.setOfferingAssets(
      store.offeringAssets.filter((curAsset) => asset.index !== curAsset.index),
    );
  };

  const onSearchClicked = () => {
    setIsLoadingAssets(true);
    setSearchContent(textInput);
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
          {searchedAssets.length > 0 && (
            <AssetPickerTable
              assets={searchedAssets}
              onDeselect={onAssetDeselected}
              onSelect={onAssetSelected}
              isOwner={false}
              isLoadingAssets={isLoadingAssets}
            />
          )}
          <br />
          <AssetAmountPickerTable assets={[]} />
        </div>
      </div>
    </div>
  );
};

export default RequestingAssetsPickerCard;
