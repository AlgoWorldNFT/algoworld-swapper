import { SwapConfiguration } from '@/models/Swap';
import axios from 'axios';

export default function saveSwapConfigurations(
  configurations: SwapConfiguration[],
) {
  return axios.post(`/api/storage/saveConfigurations`, configurations);
}
