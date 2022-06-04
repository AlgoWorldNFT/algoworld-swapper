// import { SwapConfiguration } from '@/models/Swap';
import axios from 'axios';

export default function getCompiledMultiSwap(configuration: any) {
  return axios.post(`/api/swappers/compileMultiSwap`, configuration);
}
