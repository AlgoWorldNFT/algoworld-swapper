/**
 * AlgoWorld Swapper
 * Copyright (C) 2022 AlgoWorld
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Asset, AssetWithBalance } from '@/models/Asset';
import {
  LinearProgress,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import formatAmount from '@/utils/formatAmount';
import getAssetBalance from '@/utils/api/assets/getAssetBalance';
import { useAppSelector } from '@/redux/store/hooks';

const columns: GridColDef[] = [
  {
    field: `index`,
    flex: 1,
    headerName: `Index`,
    minWidth: 50,
    maxWidth: 500,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    renderCell: (params: GridRenderCellParams<string>) => {
      const value = params.value ?? `N/A`;
      return (
        <Tooltip enterTouchDelay={0} title={<span>{value}</span>}>
          <div>{value}</div>
        </Tooltip>
      );
    },
  },
  {
    field: `name`,
    flex: 1,
    headerName: `Name`,
    minWidth: 50,
    maxWidth: 500,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    renderCell: (params: GridRenderCellParams<string>) => {
      const value = params.value ?? `N/A`;
      return (
        <Tooltip enterTouchDelay={0} title={<span>{value}</span>}>
          <div>{value}</div>
        </Tooltip>
      );
    },
  },
  {
    field: `amount`,
    flex: 1,
    headerName: `Amount`,
    minWidth: 50,
    maxWidth: 500,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    renderCell: (params) => {
      return (
        <>
          {formatAmount(
            params.row.offeringAmount > 0
              ? params.row.offeringAmount
              : params.row.requestingAmount,
            params.row.decimals,
          )}
        </>
      );
    },
  },
  {
    field: `type`,
    flex: 1,
    headerName: `Type`,
    width: 100,
    minWidth: 50,
    maxWidth: 500,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    renderCell: (params) => {
      return <>{params.row.offeringAmount > 0 ? `Offering` : `Requesting`}</>;
    },
  },
];

const columnsWithBalance: GridColDef[] = [
  ...columns,
  {
    field: `balance`,
    flex: 1,
    headerName: `Balance`,
    minWidth: 50,
    maxWidth: 500,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    renderCell: (params) => {
      return (
        <>
          {params.row.balance > 0
            ? Number(params.row.balance) / Math.pow(10, params.row.decimals)
            : `N/A`}
        </>
      );
    },
  },
];

type Props = {
  assets: Asset[];
  width?: number | string;
  customNoRowsOverlay?: React.JSXElementConstructor<any>;
  loading?: boolean;
  escrowAddress?: string;
};

const AssetsTable = ({
  assets,
  width = 400,
  customNoRowsOverlay,
  loading,
  escrowAddress,
}: Props) => {
  const theme = useTheme();
  const largeScreen = useMediaQuery(theme.breakpoints.up(`sm`));

  const chain = useAppSelector((state) => state.application.chain);
  const [assetsWithBalances, setAssetsWithBalances] = React.useState<
    AssetWithBalance[]
  >([]);

  React.useEffect(() => {
    if (escrowAddress) {
      const loadBalances = async () => {
        const assetsWithBalances: AssetWithBalance[] = await Promise.all(
          assets.map(async (asset) => {
            try {
              const balance = await getAssetBalance(
                asset.index,
                escrowAddress,
                chain,
              );
              return { ...asset, escrowAddress, balance: balance };
            } catch {
              // -1 represents no balance available at load tim
              return { ...asset, escrowAddress, balance: -1 };
            }
          }),
        );
        setAssetsWithBalances(assetsWithBalances);
      };

      loadBalances();
    }
  }, [assets, chain, escrowAddress]);

  return (
    <DataGrid
      sx={{
        width: { width },
        '& .super-app-theme--header': {
          backgroundColor: `background.paper`,
          color: `secondary.main`,
        },
        '& .cellStyle': {
          backgroundColor: `background.paper`,
        },
        height: customNoRowsOverlay && largeScreen ? `400px` : `auto`,
      }}
      loading={loading}
      components={{
        NoRowsOverlay: customNoRowsOverlay
          ? customNoRowsOverlay
          : () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                😔 No swaps available for your account
              </Stack>
            ),
        LoadingOverlay: LinearProgress,
      }}
      rows={escrowAddress ? assetsWithBalances : assets}
      hideFooter
      autoHeight={customNoRowsOverlay && largeScreen ? false : true}
      pageSize={10}
      columns={escrowAddress ? columnsWithBalance : columns}
      getRowId={(row) => {
        return `${row.index}${row.offeringAmount}${row.requestingAmount}`;
      }}
      autoPageSize
      getCellClassName={() => {
        return `cellStyle`;
      }}
    />
  );
};

export default AssetsTable;
