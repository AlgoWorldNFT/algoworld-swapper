import { Asset } from '@/models/Asset';
import { RootContext } from '@/stores';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';

type Props = {
  assets: Asset[];
};

const AssetAmountPickerTable = observer(({ assets = [] }: Props) => {
  const store = useContext(RootContext);

  const handleAddAsset = (asset: Asset) => {
    const assetIndex = store.offeringAssets.findIndex(
      (ownedAsset) => ownedAsset.index == asset.index,
    );
    const newOfferingAssets = [...store.offeringAssets];

    if (assetIndex > -1) {
      newOfferingAssets[assetIndex].amount += 1;
      store.setOfferingAssets?.(newOfferingAssets);
    } else {
      asset.amount += 1;
      store.setOfferingAssets?.([...store.owningAssets, asset]);
    }
  };

  const handleDeleteAsset = (asset: Asset) => {
    const assetIndex = store.offeringAssets.findIndex(
      (ownedAsset) => ownedAsset.index == asset.index,
    );
    const newOfferingAssets = [...store.offeringAssets];

    if (assetIndex > -1) {
      newOfferingAssets[assetIndex].amount -= 1;
      if (newOfferingAssets[assetIndex].amount <= 0) {
        store.setOwningAssets([
          ...newOfferingAssets.filter(
            (asset) => asset.index !== newOfferingAssets[assetIndex].index,
          ),
          { ...asset, amount: 0 },
        ]);
        store.setOfferingAssets(
          newOfferingAssets.filter(
            (asset) => asset.index !== newOfferingAssets[assetIndex].index,
          ),
        );
      }
    }
  };

  const getAssetFromStore = (asset: Asset) => {
    const storeAsset = store.offeringAssets.find(
      (curAsset) => curAsset.index == asset.index,
    );

    if (storeAsset !== undefined) {
      return storeAsset;
    }

    asset.amount = 0;
    return asset;
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-compact w-full text-center">
        <tbody>
          {assets.map((asset: Asset) => (
            <tr key={asset.index}>
              <td>{asset.name}</td>
              <td className="flex w-full bg-base-100 items-center justify-center pr-1 pl-1">
                <button
                  className="btn btn-sm btn-ghost btn-secondary hover:bg-black"
                  disabled={getAssetFromStore(asset).amount === 0}
                  onClick={() => {
                    handleDeleteAsset(asset);
                  }}
                >
                  -
                </button>
                <div className="divider divider-horizontal">{`x${
                  getAssetFromStore(asset).amount
                }`}</div>
                <button
                  className="btn btn-sm btn-ghost hover:bg-black"
                  disabled={getAssetFromStore(asset).amount > 4}
                  onClick={() => {
                    handleAddAsset(asset);
                  }}
                >
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default AssetAmountPickerTable;
