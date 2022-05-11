/* eslint-disable @typescript-eslint/no-unused-vars */
import { OfferingAsset, RequestingAsset } from '@/models/Asset';
import { observer } from 'mobx-react-lite';
type Props = {
  assets: OfferingAsset[] | RequestingAsset[];
  onAssetAmountIncreased: (asset: OfferingAsset | RequestingAsset) => void;
  onAssetAmountDecreased: (asset: OfferingAsset | RequestingAsset) => void;
};

const AssetAmountPickerTable = observer(
  ({ assets = [], onAssetAmountIncreased, onAssetAmountDecreased }: Props) => {
    return (
      <div className="overflow-x-auto">
        <table className="table table-compact w-full text-center">
          <tbody>
            {assets.map((asset: OfferingAsset | RequestingAsset) => (
              <tr key={asset.index}>
                <th>{asset.index}</th>
                <td>{asset.name}</td>
                <td>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Enter amount"
                      className="input input-bordered input-sm w-full"
                    />
                    <button className="btn btn-sm">max</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);

export default AssetAmountPickerTable;
