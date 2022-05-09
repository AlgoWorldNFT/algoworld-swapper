import AssetAmountPickerTable from './AssetAmountPickerTable';

type Props = {
  cardTitle: string;
};

const RequestingAssetsPickerCard = ({ cardTitle }: Props) => {
  return (
    <div className="rounded-lg shadow-xl  border-2  border-pink-700 focus:border-pink-700 hover:border-pink-600 transform transition-all">
      <div className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-lg">
        <div className="text-pink-500 text-3xl text-center font-extrabold tracking-tight">
          {cardTitle}
        </div>
        <div className="mt-4">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search..."
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
          <AssetAmountPickerTable
            assets={[
              {
                index: 12345,
                name: `AW Card #1`,
                decimals: 0,
                unit_name: `CARD`,
                amount: 0,
                image_url: `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`,
              },
              {
                index: 12255,
                name: `AW Card #2`,
                decimals: 0,
                unit_name: `CARD`,
                amount: 0,
                image_url: `https://cf-ipfs.com/ipfs/QmXrsy5TddTiwDCXqGc2yzNowKs7WhCJfQ17rvHuArfnQp`,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestingAssetsPickerCard;
