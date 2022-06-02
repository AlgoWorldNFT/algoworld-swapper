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
      console.log(params);
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
          console.log(
            `${row.index}_${row.offeringAmount}_${row.requestingAmount}`,
          );
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
