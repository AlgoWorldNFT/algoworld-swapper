import { Asset } from '@/models/Asset';
type Props = {
  assets: Asset[];
  onSelect: (asset: Asset) => void;
  onDeselect: (asset: Asset) => void;
  isOwner: boolean;
  isLoadingAssets?: boolean;
};

const AssetPickerTable = ({
  assets = [],
  onSelect,
  onDeselect,
  isOwner,
  isLoadingAssets,
}: Props) => {
  return (
    <div className="overflow-x-auto h-48 opacity-90">
      {!isLoadingAssets && (
        <>
          <table className="animate-fade-in-up table table-compact w-full text-center">
            <tbody>
              {assets.map((asset: Asset) => (
                <tr key={asset.index}>
                  <th>{asset.index}</th>
                  <td>{asset.name}</td>
                  {isOwner && <td>{`x${asset.amount}`}</td>}
                  <td className="flex w-full bg-base-100 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={asset.amount > 0}
                      onChange={(event) => {
                        event.target.checked
                          ? onSelect(asset)
                          : onDeselect(asset);
                      }}
                      className="checkbox"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {assets.length > 4 && (
            <div className="btn-group grid grid-cols-2">
              <button className="btn btn-sm bg-base-100">prev</button>
              <button className="btn btn-sm bg-base-100">next</button>
            </div>
          )}
        </>
      )}
      {isLoadingAssets && <progress className="progress w-full bg-pink-600" />}
    </div>
  );
};

export default AssetPickerTable;
