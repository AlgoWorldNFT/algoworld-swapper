import * as React from 'react';
import { SwapConfiguration } from '@/models/Swap';
import { useEffect, useState } from 'react';
import getSwapConfigurations from '@/utils/api/swaps/getSwapConfigurations';
import { LATEST_SWAP_PROXY_VERSION } from '@/common/constants';
import { ChainType } from '@/models/Chain';
import { Button, Grid, Pagination, Stack } from '@mui/material';
import { Asset } from '@/models/Asset';
import AssetsTable from './AssetsTable';
import getSwapUrl from '@/utils/api/swaps/getSwapUrl';
import { PUBLIC_SWAP_OPEN_SWAP_BUTTON_ID } from './constants';
import { IpfsGateway } from '@/models/Gateway';
import { isSafeVersion } from '@/utils/isSafeVersion';

type Props = {
  address: string;
  gateway: IpfsGateway;
  chain: ChainType;
};

const PublicSwapAssetsTable = ({ address, gateway, chain }: Props) => {
  const [swapConfigAssets, setSwapConfigAssets] = useState<Asset[][]>([]);
  const [swapConfigs, setSwapConfigs] = useState<SwapConfiguration[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);

    try {
      getSwapConfigurations({
        swap_creator: address,
        version: LATEST_SWAP_PROXY_VERSION,
        gateway: gateway,
        chain_type: chain,
      }).then(async (response) => {
        let swapConfigurationsForProxy =
          (await response.data) as SwapConfiguration[];

        swapConfigurationsForProxy = swapConfigurationsForProxy.filter(
          (config) => {
            return isSafeVersion(config.version);
          },
        );

        const swapConfigurationAssetsForProxy = swapConfigurationsForProxy.map(
          (config) => {
            return [...config.offering, ...config.requesting];
          },
        );
        setSwapConfigs(swapConfigurationsForProxy);
        setSwapConfigAssets(swapConfigurationAssetsForProxy);
        setLoading(false);
      });
    } catch (error) {
      setSwapConfigs([]);
      setSwapConfigAssets([]);
      setLoading(false);
    }
  }, [address, chain, gateway]);

  return (
    <>
      <AssetsTable
        loading={isLoading}
        assets={swapConfigAssets[page] ?? []}
        width={`auto`}
        customNoRowsOverlay={() => (
          <Stack height="100%" alignItems="center" justifyContent="center">
            😔 User opted in the visibility token but has no public swaps yet
          </Stack>
        )}
      />
      <Grid
        sx={{ pt: 2 }}
        container
        justifyContent="space-between"
        alignItems="center"
      >
        {swapConfigs.length > 0 && (
          <Button
            id={PUBLIC_SWAP_OPEN_SWAP_BUTTON_ID}
            href={getSwapUrl(swapConfigs[page], chain)}
            target={`_blank`}
            variant="outlined"
          >
            Open Swap
          </Button>
        )}
        <Pagination
          shape="rounded"
          variant="outlined"
          color="primary"
          count={swapConfigAssets.length}
          page={page + 1}
          onChange={(_, value) => setPage(value - 1)}
        />
      </Grid>
    </>
  );
};

export default PublicSwapAssetsTable;
