import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SwapConfiguration } from '@/models/Swap';
import { SwapType } from '@/models/Swap';
import { Asset } from '@/models/Asset';
import { ellipseAddress } from '@/redux/helpers/utilities';
import { Button } from '@mui/material';

const assetsToRowString = (assets: Asset[]) => {
  let response = ``;

  for (const asset of assets) {
    response += `${asset.index}: ${asset.name} x${asset.offeringAmount}\n`;
  }

  return response;
};

const columns: GridColDef[] = [
  {
    field: `escrow`,
    headerName: `Escrow`,
    width: 159,
    headerAlign: `center`,
    align: `center`,
    valueFormatter: ({ value }) => {
      return value;
    },
  },
  {
    field: `offering`,
    headerName: `Offering`,
    valueFormatter: ({ value }) => {
      return assetsToRowString(value);
    },
    width: 150,
    headerAlign: `center`,
    align: `center`,
    minWidth: 150,
    maxWidth: 200,
  },
  {
    field: `requesting`,
    headerName: `Requesting`,
    valueFormatter: ({ value }) => {
      return assetsToRowString(value);
    },
    width: 150,
    minWidth: 150,
    headerAlign: `center`,
    align: `center`,
    maxWidth: 200,
  },
  { field: `version`, headerName: `Version`, headerAlign: `center` },
  {
    field: `type`,
    headerName: `Type`,
    headerAlign: `center`,
    align: `center`,
    valueFormatter: ({ value }) => {
      return value === SwapType.ASA_TO_ASA ? `Asa to Asa` : `Multi Asa to Algo`;
    },
  },
  {
    field: `action`,
    headerName: `Action`,
    sortable: false,
    headerAlign: `center`,
    align: `center`,
    renderCell: () => {
      const onClick = () => {
        return alert(JSON.stringify({ hello: `world` }, null, 4));
      };

      return (
        <Button
          onClick={() => {
            onClick();
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
    <div style={{ height: 400, width: `100%` }}>
      <DataGrid
        rows={swapConfigurations}
        columns={columns}
        getRowId={(row) => row.escrow}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};

export default MySwapsTable;
