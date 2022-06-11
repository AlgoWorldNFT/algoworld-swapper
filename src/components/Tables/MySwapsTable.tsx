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
import { SwapConfiguration } from '@/models/Swap';
import { SwapType } from '@/models/Swap';
import { Asset } from '@/models/Asset';
import { Box, Button, Stack, Tooltip } from '@mui/material';
import store from '@/redux/store';
import {
  setIsManageSwapPopupOpen,
  setSelectedManageSwap,
} from '@/redux/slices/applicationSlice';

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
    field: `escrow`,
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
  {
    field: `offering`,
    flex: 1,
    headerName: `Offering`,
    valueFormatter: ({ value }) => {
      return assetsToRowString(value);
    },
    width: 100,
    minWidth: 80,
    maxWidth: 150,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    renderCell: (params: GridRenderCellParams<Asset[]>) => {
      const values = params.value ?? [];
      return values.length > 0 ? (
        <Tooltip
          enterTouchDelay={0}
          title={
            <span style={{ whiteSpace: `pre-line` }}>
              {assetsToRowString(values)}
            </span>
          }
        >
          <div>{values[0].index}...</div>
        </Tooltip>
      ) : (
        `No assets available...`
      );
    },
  },
  {
    field: `requesting`,
    flex: 1,
    headerName: `Requesting`,
    width: 100,
    minWidth: 80,
    maxWidth: 150,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    renderCell: (params: GridRenderCellParams<Asset[]>) => {
      const values = params.value ?? [];
      return values.length > 0 ? (
        <Tooltip
          enterTouchDelay={0}
          title={
            <span style={{ whiteSpace: `pre-line` }}>
              {assetsToRowString(values, false)}
            </span>
          }
        >
          <div>{values[0].index}...</div>
        </Tooltip>
      ) : (
        `No assets available...`
      );
    },
  },
  {
    field: `version`,
    flex: 1,
    width: 100,
    minWidth: 80,
    maxWidth: 150,
    headerName: `Version`,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
  },
  {
    field: `type`,
    flex: 1,
    width: 150,
    minWidth: 100,
    maxWidth: 200,
    headerName: `Type`,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    valueFormatter: ({ value }) => {
      return value === SwapType.ASA_TO_ASA ? `Asa to Asa` : `Multi Asa to Algo`;
    },
  },
  {
    field: `action`,
    flex: 1,
    width: 100,
    minWidth: 80,
    maxWidth: 150,
    headerName: `Action`,
    sortable: false,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    renderCell: (params) => {
      return (
        <Button
          onClick={() => {
            store.dispatch(setSelectedManageSwap(params.row));
            store.dispatch(setIsManageSwapPopupOpen(true));
          }}
        >
          Manage
        </Button>
      );
    },
  },
];

type Props = {
  swapConfigurations: SwapConfiguration[];
};

const MySwapsTable = ({ swapConfigurations }: Props) => {
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
        rows={swapConfigurations}
        columns={columns}
        hideFooter={swapConfigurations.length === 0}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              😔 No swaps available for your account
            </Stack>
          ),
        }}
        autoHeight
        getRowId={(row) => row.escrow}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getCellClassName={() => {
          return `cellStyle`;
        }}
      />
    </Box>
  );
};

export default MySwapsTable;
