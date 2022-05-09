import AssetAmountPickerTable from './AssetAmountPickerTable';
import AssetPickerTable from './AssetPickerTable';
import { observer } from 'mobx-react-lite';
import { useContext, useMemo, useState } from 'react';
import { RootContext } from '@/stores';
import { Asset } from '@/models/Asset';

type Props = {
  cardTitle: string;
};

const OwningAssetsPickerCard = observer(({ cardTitle = `` }: Props) => {
  const store = useContext(RootContext);

  const [searchContent, setSearchContent] = useState(``);

  const searchedOwningAssets = useMemo(() => {
    return store.owningAssets.filter(
      (asset) =>
        searchContent !== `` &&
        (String(asset.index).includes(searchContent) ||
          asset.name.toLowerCase().includes(searchContent.toLowerCase()) ||
          asset.unit_name.toLowerCase().includes(searchContent.toLowerCase())),
    );
  }, [searchContent, store.owningAssets]);

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchContent(e.target.value);
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

  return (
    <div className="rounded-lg shadow-xl  border-2  border-pink-700 focus:border-pink-700 hover:border-pink-600 transform transition-all">
      <div className="card w-96 bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-lg">
        <div className="text-pink-500 text-3xl text-center font-extrabold tracking-tight">
          {cardTitle}
        </div>
        <div className="flex flex-col w-full">
          <div className="mt-4 grid flex-grow">
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  value={searchContent}
                  placeholder="Type to choose..."
                  className="input w-full outline-none focus:outline-none hover:outline-none outline-0"
                  onChange={onSearchInputChange}
                />
                <button
                  className="btn btn-square"
                  disabled={searchContent === ``}
                  onClick={() => setSearchContent(``)}
                >
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M5,5 L19,19"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {searchedOwningAssets.length > 0 && (
              <AssetPickerTable
                assets={searchedOwningAssets}
                onDeselect={onAssetDeselected}
                onSelect={onAssetSelected}
                isOwner
              />
            )}
          </div>
          {store.offeringAssets.length > 0 && (
            <>
              <div className="animate-fade-in-up divider divider-vertical ">
                Selected assets
              </div>
              <div className="animate-fade-in-up grid flex-grow">
                <AssetAmountPickerTable assets={store.offeringAssets} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default OwningAssetsPickerCard;
