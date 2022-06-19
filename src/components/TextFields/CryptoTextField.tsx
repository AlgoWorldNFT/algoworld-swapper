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

import { CoinType } from '@/models/CoinType';
import { TextField } from '@mui/material';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { CRYPTO_TEXT_FIELD_ID } from './constants';

type Props = {
  coinType: CoinType;
  label: string;
  value: number | string | undefined;
  onChange: (value: number | undefined) => void;
  decimals: number;
  maxValue: number;
  sx?: any;
  disabled?: boolean;
};

const CryptoTextField = ({
  coinType,
  label,
  value,
  onChange,
  maxValue,
  disabled = false,
  decimals,
  sx,
}: Props) => {
  return (
    <NumberFormat
      id={CRYPTO_TEXT_FIELD_ID}
      sx={sx}
      disabled={disabled}
      fullWidth
      displayType="input"
      placeholder="Enter amount"
      value={value}
      prefix={coinType === CoinType.ALGO ? `🪙 ` : `🎴 `}
      label={label}
      decimalScale={decimals}
      customInput={TextField}
      isAllowed={(inputObj) => {
        return Number(inputObj.value) <= maxValue;
      }}
      onValueChange={(values: NumberFormatValues) => {
        const value = values.floatValue;
        onChange(value);
      }}
      thousandSeparator={true}
      decimalSeparator={`.`}
    />
  );
};

export default CryptoTextField;
