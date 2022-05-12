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
    <div className="overflow-x-auto opacity-90">
      {!isLoadingAssets && (
        <>
          <table className="animate-fade-in-up table table-compact w-full text-center">
            <tbody>
              {assets.map((asset: Asset) => (
                <tr key={asset.index}>
                  <th>{asset.index}</th>
                  <td>{asset.name}</td>
                  {isOwner && <td>{`${asset.amount} available`}</td>}
                  <td className="flex w-full bg-base-100 items-center justify-center">
                    <input
                      type="checkbox"
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
        </>
      )}
      {isLoadingAssets && (
        <progress className="progress w-full progress-warning" />
      )}
    </div>
  );
};

export default AssetPickerTable;
