import axios from 'axios';

export default function getCompiledSwap(params: {
  [key: string]: string | number;
}) {
  return axios.get(`/api/swappers/compileSwap`, {
    params: params,
  });
}
