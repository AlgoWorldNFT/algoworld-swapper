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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

type Props = {
  title: string;
  description: string;
};

const PageHeader = ({ title, description }: Props) => {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        pt: 5,
        pb: 5,
      }}
    >
      <Typography
        component="h1"
        variant={`h4`}
        align="center"
        color="text.primary"
        gutterBottom
      >
        {title}
      </Typography>
      <Typography
        variant={`body1`}
        align="center"
        color="text.secondary"
        component="p"
      >
        {description}
      </Typography>
    </Container>
  );
};

export default PageHeader;
