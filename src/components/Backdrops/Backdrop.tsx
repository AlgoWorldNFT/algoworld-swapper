import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';

type Props = {
  open: boolean;
  setOpen?: (open: boolean) => void;
  loadingText?: string;
  noCircularProgress?: boolean;
  closeAfter?: number | undefined;
};

const LoadingBackdrop = ({
  open = false,
  setOpen,
  loadingText = `Loading...`,
  noCircularProgress = false,
  closeAfter = undefined,
}: Props) => {
  React.useEffect(() => {
    if (closeAfter) {
      const timeout = setTimeout(() => {
        if (setOpen) {
          setOpen(false);
        }
      }, closeAfter);
      clearTimeout(timeout);
    }
  });

  return (
    <div>
      <Backdrop
        sx={{ color: `#fff`, zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={() => {
          if (setOpen) {
            setOpen(false);
          }
        }}
      >
        {!noCircularProgress && <CircularProgress color="inherit" />}
        {loadingText && <Typography variant="h5">{loadingText}</Typography>}
      </Backdrop>
    </div>
  );
};

export default LoadingBackdrop;
