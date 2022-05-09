import { Asset } from '@/models/Asset';
type Props = {
  assets: Asset[];
  onSelect: (asset: Asset) => void;
  onDeselect: (asset: Asset) => void;
};

const AssetPickerTable = ({ assets = [], onSelect, onDeselect }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-compact w-full text-center">
        <tbody>
          {assets.map((asset: Asset) => (
            <tr key={asset.index}>
              <th>{asset.index}</th>
              <td>{asset.name}</td>
              <td className="flex w-full bg-base-100 items-center justify-center pr-1 pl-1">
                <input
                  type="checkbox"
                  checked={asset.amount > 0}
                  onChange={(event) => {
                    event.target.checked ? onSelect(asset) : onDeselect(asset);
                  }}
                  className="checkbox"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {assets.length > 5 && (
        <div className="btn-group grid grid-cols-3 pt-4">
          <button className="btn border-transparent bg-transparent">«</button>
          <button className="btn border-transparent bg-transparent">
            Page 1
          </button>
          <button className="btn border-transparent bg-transparent ">»</button>
        </div>
      )}
    </div>
  );
};

export default AssetPickerTable;
