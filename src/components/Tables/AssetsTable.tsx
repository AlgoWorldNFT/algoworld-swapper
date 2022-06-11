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
import { Box } from '@mui/material';
import formatAmount from '@/utils/formatAmount';

const columns: GridColDef[] = [
  {
    field: `index`,
    flex: 1,
    headerName: `Index`,
    width: 100,
    minWidth: 50,
    maxWidth: 150,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
  },
  {
    field: `name`,
    flex: 1,
    headerName: `Name`,
    width: 100,
    minWidth: 50,
    maxWidth: 150,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
  },
  {
    field: `amount`,
    flex: 1,
    headerName: `Amount`,
    width: 100,
    minWidth: 50,
    maxWidth: 150,
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
    maxWidth: 150,
    headerAlign: `center`,
    headerClassName: `super-app-theme--header`,
    align: `center`,
    renderCell: (params) => {
      return <>{params.row.offeringAmount > 0 ? `Offering` : `Requesting`}</>;
    },
  },
];

type Props = {
  assets: Asset[];
};

const AssetsTable = ({ assets }: Props) => {
  return (
    <Box
      sx={{
        width: 400,
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
        rows={assets}
        hideFooter
        autoHeight
        pageSize={10}
        columns={columns}
        getRowId={(row) => {
          return `${row.index}${row.offeringAmount}${row.requestingAmount}`;
        }}
        autoPageSize
        getCellClassName={() => {
          return `cellStyle`;
        }}
      />
    </Box>
  );
};

export default AssetsTable;
