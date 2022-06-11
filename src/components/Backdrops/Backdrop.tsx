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
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';
import { Stack, Typography } from '@mui/material';

type Props = {
  isLoading: boolean;
  message?: string;
};

const LoadingBackdrop = ({
  isLoading = false,
  message = `Loading...`,
}: Props) => {
  return (
    <div>
      <Backdrop
        sx={{
          color: `#fff`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          opacity: 0.3,
        }}
        open={isLoading}
      >
        <Stack sx={{ maxWidth: `90%` }} spacing={1}>
          {message && (
            <Typography color="primary" variant="h6">
              {message}
            </Typography>
          )}
          <LinearProgress color="secondary" />
        </Stack>
      </Backdrop>
    </div>
  );
};

export default LoadingBackdrop;
