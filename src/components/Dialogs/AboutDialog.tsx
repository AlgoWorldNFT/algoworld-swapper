import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function AboutDialog({ open, setOpen }: Props) {
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Dialog
        open={open}
        scroll={`paper`}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle color={`primary`} id="scroll-dialog-title">
          AlgoWorld Swapper v0.1.0
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText ref={descriptionElementRef} tabIndex={-1}>
            {`AlgoWorld Swapper is a free and open-source tool for swapping assets on Algorand blockchain. Distributed under GPLv3 license.
            Swaps are powered by Algorand Smart Signatures and were developed in collaboration with a Solution Architect from Algorand (credits: @cusma). AlgoWorld currently charges 0.5 Algo fee per swap as an incentive fee for further development and hosting.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
