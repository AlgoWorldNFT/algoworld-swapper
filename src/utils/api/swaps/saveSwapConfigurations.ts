import { SwapConfiguration } from '@/models/Swap';
import axios from 'axios';

export default function saveSwapConfigurations(
  configurations: SwapConfiguration[],
) {
  console.log(JSON.stringify(configurations));
  return axios.post(`/api/storage/saveConfigurations`, configurations);
}
