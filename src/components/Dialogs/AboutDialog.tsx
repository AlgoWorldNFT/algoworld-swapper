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
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import pJson from '../../../package.json';
import { ABOUT_DIALOG_ID } from './constants';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PRIVACY_MD, TOC_MD } from '@/common/constants';
import useSWR from 'swr';
import ReactMarkdown from 'react-markdown';

type Props = {
  open: boolean;
  changeState: (open: boolean) => void;
};

export default function AboutDialog({ open, changeState }: Props) {
  const descriptionElementRef = React.useRef<HTMLElement>(null);

  const tocMdResponse = useSWR(TOC_MD, (url) => {
    return fetch(url).then((res) => {
      return res.text();
    });
  });

  const privacyMdResponse = useSWR(PRIVACY_MD, (url) => {
    return fetch(url).then((res) => {
      return res.text();
    });
  });

  const tocMd: string = React.useMemo(() => {
    if (tocMdResponse.error || !tocMdResponse.data) {
      return `N/A`;
    }

    return tocMdResponse.data;
  }, [tocMdResponse]);

  const privacyMd: string = React.useMemo(() => {
    if (privacyMdResponse.error || !privacyMdResponse.data) {
      return `N/A`;
    }

    return privacyMdResponse.data;
  }, [privacyMdResponse]);

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
        id={ABOUT_DIALOG_ID}
        open={open}
        scroll={`paper`}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle color={`primary`} id="scroll-dialog-title">
          AlgoWorld Swapper v{pJson.version}
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText ref={descriptionElementRef} tabIndex={-1}>
            {`AlgoWorld Swapper is a free and open-source tool for swapping assets on Algorand blockchain. Distributed under GPLv3 license.
            Swaps are powered by Algorand Smart Signatures and were developed in collaboration with a Solution Architect from Algorand (credits: @cusma). AlgoWorld currently charges 0.05 Algo fee per swap, the fee is then periodically transfered to AWT/ALGO pair on Tinyman to increase liquidity for AlgoWorld Token.`}
          </DialogContentText>
          <br />
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Terms of services</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ReactMarkdown>{tocMd}</ReactMarkdown>
            </AccordionDetails>
          </Accordion>
          <br />
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Privacy policy</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ReactMarkdown>{privacyMd}</ReactMarkdown>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              changeState(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
