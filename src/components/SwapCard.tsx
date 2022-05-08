import AssetPickerTable from './AssetPickerTable';

type Props = {
  cardTitle: string;
};

const SwapCard = ({ cardTitle }: Props) => (
  <div className="rounded-lg shadow-xl  border-2  border-pink-700 focus:border-pink-700 hover:border-pink-600 transform transition-all">
    <div className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-lg">
      <div className="text-pink-500 text-3xl text-center font-extrabold tracking-tight">
        {cardTitle}
      </div>
      <div className="mt-4">
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text">Select ASAs</span>
          </label>
          <input
            type="text"
            placeholder="Tap to choose"
            className="input input-bordered w-full "
          />
        </div>
        <br />
        <AssetPickerTable
          assets={[
            {
              index: 12345,
              name: `AW Card #1`,
              decimals: 0,
              unit_name: `CARD`,
              amount: 0,
              image_url: `https://bafybeieno6mp2uxchmfh2tuc5hetkovwukjhcmezmimqlzhxyiysumc5le.ipfs.cf-ipfs.com/`,
            },
          ]}
        />
      </div>
    </div>
  </div>
);

export default SwapCard;
