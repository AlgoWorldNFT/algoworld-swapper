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

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

type Props = {
  label: string;
  value: string;
  values: string[];
  onSelect: (value: string) => void;
  id?: string;
};

const ValueSelect = ({ id, label, value, values, onSelect }: Props) => {
  return (
    <FormControl sx={{ p: 1, width: `100%` }} size="small" id={id}>
      <InputLabel id="demo-select-small">{label}</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={value}
        label={label}
        onChange={(event) => {
          onSelect(event.target.value);
        }}
      >
        {values.map((currentValue) => {
          return (
            <MenuItem key={currentValue} value={currentValue}>
              {currentValue}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default ValueSelect;
