import { ChainType } from '@/models/Chain';
import axios from 'axios';

const NFD_MAINNET = `https://api.nf.domains`;
const NFD_TESTNET = `https://api.testnet.nf.domains`;

const getNFDsForAddress = async (address: string, chain: ChainType) => {
  try {
    const url = `${
      chain === ChainType.MainNet ? NFD_MAINNET : NFD_TESTNET
    }/nfd`;
    const response = await axios.get(url, {
      params: {
        owner: address,
      },
    });
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    // handle error
    return null;
  }
};

export default getNFDsForAddress;
