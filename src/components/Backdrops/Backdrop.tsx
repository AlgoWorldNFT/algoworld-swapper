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
