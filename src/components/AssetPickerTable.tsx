import { Asset } from '@/models/Asset';
import { RootContext } from '@/stores';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';

type Props = {
  assets: Asset[];
};

const AssetPickerTable = observer(({ assets = [] }: Props) => {
  const store = useContext(RootContext);

  const handleAddAsset = (asset: Asset) => {
    const assetIndex = store.owningAssets.findIndex(
      (ownedAsset) => ownedAsset.index == asset.index,
    );
    const newOwningAssets = [...store.owningAssets];

    if (assetIndex > -1) {
      newOwningAssets[assetIndex].amount += 1;
      store.setOwningAssets?.(newOwningAssets);
    } else {
      asset.amount += 1;
      store.setOwningAssets?.([...store.owningAssets, asset]);
    }
  };

  const handleDeleteAsset = (asset: Asset) => {
    const assetIndex = store.owningAssets.findIndex(
      (ownedAsset) => ownedAsset.index == asset.index,
    );
    const newOwningAssets = [...store.owningAssets];

    if (assetIndex > -1) {
      newOwningAssets[assetIndex].amount -= 1;
      if (newOwningAssets[assetIndex].amount <= 0) {
        store.setOwningAssets(
          newOwningAssets.filter(
            (asset) => asset.index !== newOwningAssets[assetIndex].index,
          ),
        );
      }
    }
  };

  const getAssetFromStore = (asset: Asset) => {
    const storeAsset = store.owningAssets.find(
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
      <table className="table w-full text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset: Asset) => (
            <tr key={asset.index}>
              <th>{asset.index}</th>
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

export default AssetPickerTable;
