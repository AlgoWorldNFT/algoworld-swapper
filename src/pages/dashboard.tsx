import OwningAssetsPickerCard from '@/components/OwningAssetsPickerCard';
import RequestingAssetsPickerCard from '@/components/RequestingAssetsPickerCard';
import ParticlesContainer from '@/components/ParticlesContainer';

export default function Dashboard() {
  return (
    <div>
      {/* <h1 className="z-10 py-6 text-3xl md:text-4xl text-white dark:text-white text-center font-extrabold whitespace-nowrap tracking-tight">
        AlgoWorld Swapper
      </h1>
      <h2 className="z-10 text-xl md:text-2xl dark:text-white text-white text-center font-extrabold whitespace-nowrap tracking-tight">
        Simple, Secure and Open-Source
      </h2>
      <h3 className="z-10 md:text-md text-sm text-yellow-400 black:text-yellow-400 text-center italic whitespace-nowrap tracking-tight pb-10">
        powered by Algorand Smart Contracts
      </h3> */}
      <ParticlesContainer />

      <div className="z-10">
        <div className="flex flex-col w-full">
          <div className="grid flex-grow place-items-center">
            <OwningAssetsPickerCard cardTitle="From" />
          </div>
          <div className="grid md:col-span-1 pt-4 pb-4 row-span-1 justify-center content-center">
            <button className="w-24 btn btn-primary bg-pink-600 hover:bg-black  border-pink-700 focus:border-pink-700 hover:border-pink-600">
              Create
            </button>
          </div>
          <div className="grid flex-grow place-items-center">
            <RequestingAssetsPickerCard cardTitle={`To`} />
          </div>
        </div>
      </div>
    </div>
  );
}
