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
import { Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { ellipseAddress } from '@/redux/helpers/utilities';

import { ChainType } from '@/models/Chain';
import PublicSwapAssetsTable from '../Tables/PublicSwapAssetsTable';

// const AWVT_CREATOR_ADDRESS = `SUF5OEJIPBSBYELHBPOXWR3GH5T2J5Y7XHW5K6L3BJ2FEQ4A6XQZVNN4UM`;

type Props = {
  publicSwapAccounts: string[];
  chain: ChainType;
};

const PublicSwapsGrid = ({ publicSwapAccounts, chain }: Props) => {
  return (
    <Container sx={{ py: 4, pr: 0, pl: 0 }} maxWidth="xl">
      {/* End hero unit */}
      <Grid
        justifyContent={
          publicSwapAccounts.length === 1 ? `center` : `flex-start`
        }
        alignContent="center"
        alignItems="stretch"
        container
        spacing={4}
      >
        {publicSwapAccounts.map((account) => (
          <Grid item key={account} xs={12} sm={6} md={6}>
            <Card>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {`${ellipseAddress(account, 4)}`}
                </Typography>
                <PublicSwapAssetsTable address={account} chain={chain} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PublicSwapsGrid;
