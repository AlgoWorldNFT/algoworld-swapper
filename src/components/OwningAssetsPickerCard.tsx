import AssetAmountPickerTable from './AssetAmountPickerTable';
import AssetPickerTable from './AssetPickerTable';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { RootContext } from '@/stores';
import { Asset } from '@/models/Asset';

type Props = {
  cardTitle: string;
};

const OwningAssetsPickerCard = observer(({ cardTitle = `` }: Props) => {
  const store = useContext(RootContext);

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
      <div className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-lg">
        <div className="text-pink-500 text-3xl text-center font-extrabold tracking-tight">
          {cardTitle}
        </div>
        <div className="flex w-full">
          <div className="mt-4 grid flex-grow">
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Filter…"
                  className="input input-bordered w-full"
                />
                <button className="btn btn-square">
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
            <br />
            <AssetPickerTable
              assets={store.owningAssets}
              onDeselect={onAssetDeselected}
              onSelect={onAssetSelected}
            />
          </div>
          {store.offeringAssets.length > 0 && (
            <>
              <div className="divider divider-horizontal pt-10 pb-10"></div>
              <div className="mt-4 grid flex-grow">
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
