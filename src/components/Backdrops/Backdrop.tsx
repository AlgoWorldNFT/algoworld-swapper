import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';

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
        sx={{ color: `#fff`, zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        {<CircularProgress color="inherit" />}
        {message && <Typography variant="h5">{message}</Typography>}
      </Backdrop>
    </div>
  );
};

export default LoadingBackdrop;
