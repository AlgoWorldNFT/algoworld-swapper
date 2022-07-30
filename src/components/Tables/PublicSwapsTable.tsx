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
import {
  Box,
  Button,
  Pagination,
  Stack,
  TablePagination,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { SwapConfiguration, SwapType } from '@/models/Swap';
import { MY_SWAPS_TABLE_MANAGE_BTN_ID } from './constants';
import { Asset } from '@/models/Asset';
import next from 'next';
import { ellipseAddress } from '@/redux/helpers/utilities';

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
    field: `creator`,
    flex: 1,
    headerName: `Creator`,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    valueFormatter: ({ value }) => {
      return ellipseAddress(value, 4);
    },
  },
  {
    field: `escrow`,
    flex: 1,
    headerName: `Escrow`,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    valueFormatter: ({ value }) => {
      return ellipseAddress(value, 4);
    },
    renderCell: (params: GridRenderCellParams<string>) => {
      const value = params.value;
      return (
        <Tooltip
          enterTouchDelay={0}
          title={<span style={{ whiteSpace: `pre-line` }}>{value}</span>}
        >
          <>{ellipseAddress(value, 4)}</>
        </Tooltip>
      );
    },
  },
  {
    field: `offering`,
    flex: 1,
    headerName: `Offering`,
    valueFormatter: ({ value }) => {
      return assetsToRowString(value);
    },
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
    headerName: `Version`,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
  },
  {
    field: `type`,
    flex: 1,
    headerName: `Type`,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    valueFormatter: ({ value }) => {
      return value === SwapType.ASA_TO_ASA ? `Asa to Asa` : `Asas to Algo`;
    },
  },
  {
    field: `action`,
    flex: 1,
    headerName: `Action`,
    sortable: false,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    renderCell: (params) => {
      return (
        <Button id={MY_SWAPS_TABLE_MANAGE_BTN_ID(params.row.escrow)} href="#">
          Open
        </Button>
      );
    },
  },
];

const AWVT_CREATOR_ADDRESS = `SUF5OEJIPBSBYELHBPOXWR3GH5T2J5Y7XHW5K6L3BJ2FEQ4A6XQZVNN4UM`;

type Props = {
  nextToken: string;
  swapConfigurations: SwapConfiguration[];
  page: number;
  handleChangePage: (page: number, nextToken: string) => void;
};

const PublicSwapsTable = ({
  nextToken,
  swapConfigurations,
  page,
  handleChangePage,
}: Props) => {
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
              😔 No public swaps available yet
            </Stack>
          ),
          Pagination: () => (
            <TablePagination
              component="div"
              count={-1}
              page={page}
              onPageChange={(_, value) => {
                if (nextToken) {
                  handleChangePage(value, nextToken);
                }
              }}
              rowsPerPage={1}
              rowsPerPageOptions={[]}
            />
          ),
        }}
        pagination
        pageSize={
          swapConfigurations.length <= 100 ? swapConfigurations.length : 100
        }
        autoHeight
        getRowId={(row) => row.escrow}
        getCellClassName={() => {
          return `cellStyle`;
        }}
      />
    </Box>
  );
};

export default PublicSwapsTable;
