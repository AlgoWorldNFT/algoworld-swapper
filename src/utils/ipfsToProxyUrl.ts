export const ipfsToProxyUrl = (ipfsUrl: string) => {
  return ipfsUrl.includes(`ipfs://`)
    ? `https://cf-ipfs.com/ipfs/${ipfsUrl.split(`ipfs://`)[1]}`
    : ipfsUrl;
};
