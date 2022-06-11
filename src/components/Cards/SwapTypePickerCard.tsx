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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid } from '@mui/material';
import Link from 'next/link';

type Props = {
  title: string;
  description: string;
  emojiContent: string;
  swapPageUrl: string;
  disabled?: boolean;
};

const SwapTypePickerCard = ({
  title,
  description,
  emojiContent,
  swapPageUrl,
  disabled = false,
}: Props) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        minWidth: 150,
      }}
    >
      <Link href={swapPageUrl}>
        <CardActionArea disabled={disabled}>
          <CardContent>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: `20vh` }}
            >
              <Grid item xs={3}>
                <Typography
                  sx={{ width: `100%`, textAlign: `center` }}
                  component="div"
                  variant="h2"
                >
                  {emojiContent}
                </Typography>
              </Grid>
            </Grid>

            <Typography
              textAlign={`center`}
              gutterBottom
              variant="h5"
              color="primary.main"
              component="div"
            >
              {title}
            </Typography>
            <Typography color="info.main" variant="body2">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default SwapTypePickerCard;
