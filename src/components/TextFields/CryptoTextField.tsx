import { CoinType } from '@/models/CoinType';
import { TextField } from '@mui/material';
import NumberFormat, { NumberFormatValues } from 'react-number-format';

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
