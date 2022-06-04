import axios from 'axios';

export default function getCompiledProxy(params: {
  [key: string]: string | number;
}) {
  return axios.get(`/api/swappers/compileSwapProxy`, {
    params: params,
  });
}
