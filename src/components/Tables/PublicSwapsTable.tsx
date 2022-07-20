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
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Asset } from '@/models/Asset';
import { Box, Stack } from '@mui/material';
import { useAppSelector } from '@/redux/store/hooks';
import { useEffect, useState } from 'react';
import getAssetsForVisibilityToken from '@/utils/api/assets/getAssetsForVisibilityToken';
import { useEffectOnce } from 'react-use';

const assetsToRowString = (assets: Asset[], offering = true) => {
  let response = ``;

  let index = 1;
  for (const asset of assets) {
    response += `${index}. ${asset.index}: ${asset.name} x${
      offering ? asset.offeringAmount : asset.requestingAmount
    }\n`;
    index += 1;
  }

  return response;
};

const columns: GridColDef[] = [
  {
    field: `address`,
    flex: 1,
    headerName: `Escrow`,
    width: 200,
    minWidth: 150,
    maxWidth: 250,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    valueFormatter: ({ value }) => {
      return value;
    },
  },
  // {
  //   field: `offering`,
  //   flex: 1,
  //   headerName: `Offering`,
  //   valueFormatter: ({ value }) => {
  //     return assetsToRowString(value);
  //   },
  //   width: 100,
  //   minWidth: 80,
  //   maxWidth: 150,
  //   headerAlign: `center`,
  //   headerClassName: `super-app-theme--header`,
  //   align: `center`,
  //   renderCell: (params: GridRenderCellParams<Asset[]>) => {
  //     const values = params.value ?? [];
  //     return values.length > 0 ? (
  //       <Tooltip
  //         enterTouchDelay={0}
  //         title={
  //           <span style={{ whiteSpace: `pre-line` }}>
  //             {assetsToRowString(values)}
  //           </span>
  //         }
  //       >
  //         <div>{values[0].index}...</div>
  //       </Tooltip>
  //     ) : (
  //       `No assets available...`
  //     );
  //   },
  // },
  // {
  //   field: `requesting`,
  //   flex: 1,
  //   headerName: `Requesting`,
  //   width: 100,
  //   minWidth: 80,
  //   maxWidth: 150,
  //   headerAlign: `center`,
  //   headerClassName: `super-app-theme--header`,
  //   align: `center`,
  //   renderCell: (params: GridRenderCellParams<Asset[]>) => {
  //     const values = params.value ?? [];
  //     return values.length > 0 ? (
  //       <Tooltip
  //         enterTouchDelay={0}
  //         title={
  //           <span style={{ whiteSpace: `pre-line` }}>
  //             {assetsToRowString(values, false)}
  //           </span>
  //         }
  //       >
  //         <div>{values[0].index}...</div>
  //       </Tooltip>
  //     ) : (
  //       `No assets available...`
  //     );
  //   },
  // },
  // {
  //   field: `version`,
  //   flex: 1,
  //   width: 100,
  //   minWidth: 80,
  //   maxWidth: 150,
  //   headerName: `Version`,
  //   headerAlign: `center`,
  //   headerClassName: `super-app-theme--header`,
  //   align: `center`,
  // },
  // {
  //   field: `type`,
  //   flex: 1,
  //   width: 150,
  //   minWidth: 100,
  //   maxWidth: 200,
  //   headerName: `Type`,
  //   headerAlign: `center`,
  //   headerClassName: `super-app-theme--header`,
  //   align: `center`,
  //   valueFormatter: ({ value }) => {
  //     return value === SwapType.ASA_TO_ASA ? `Asa to Asa` : `Asas to Algo`;
  //   },
  // },
  // {
  //   field: `action`,
  //   flex: 1,
  //   width: 100,
  //   minWidth: 80,
  //   maxWidth: 150,
  //   headerName: `Action`,
  //   sortable: false,
  //   headerAlign: `center`,
  //   headerClassName: `super-app-theme--header`,
  //   align: `center`,
  //   renderCell: (params) => {
  //     return (
  //       <Button
  //         id={MY_SWAPS_TABLE_MANAGE_BTN_ID(params.row.escrow)}
  //         onClick={() => {
  //           store.dispatch(setSelectedManageSwap(params.row));
  //           store.dispatch(setIsManageSwapPopupOpen(true));
  //         }}
  //       >
  //         Manage
  //       </Button>
  //     );
  //   },
  // },
];

const AWVT_CREATOR_ADDRESS = `SUF5OEJIPBSBYELHBPOXWR3GH5T2J5Y7XHW5K6L3BJ2FEQ4A6XQZVNN4UM`;

const PublicSwapsTable = () => {
  const [publicSwaps, setPublicSwaps] = useState<Record<string, any>[]>([]);
  const [nextToken, setNextToken] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);

  const chain = useAppSelector((state) => state.walletConnect.chain);

  const updateSwaps = async (page = 0) => {
    const latestSwaps = await getAssetsForVisibilityToken(
      100256867,
      chain,
      nextToken,
    );

    if (`next-token` in latestSwaps && latestSwaps[`next-token`]) {
      setNextToken(latestSwaps[`next-token`]);
    }

    setPublicSwaps(latestSwaps.accounts);
  };

  useEffectOnce(() => {
    const loadSwaps = async () => {
      await updateSwaps();
    };

    loadSwaps();
  });

  return (
    <Box
      sx={{
        width: 1,
        '& .super-app-theme--header': {
          backgroundColor: `background.paper`,
          color: `secondary.main`,
        },
        '& .cellStyle': {
          backgroundColor: `background.paper`,
        },
      }}
    >
      <DataGrid
        rows={publicSwaps}
        columns={columns}
        hideFooter={publicSwaps.length === 0}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              😔 No public swaps available yet
            </Stack>
          ),
        }}
        autoHeight
        getRowId={(row) => row[`address`]}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getCellClassName={() => {
          return `cellStyle`;
        }}
        page={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
      />
    </Box>
  );
};

export default PublicSwapsTable;
