import { TextField } from '@mui/material';
import NumberFormat, { NumberFormatValues } from 'react-number-format';

export enum CryptoTextFieldType {
  ALGO,
  ASA,
}

type Props = {
  coinType: CryptoTextFieldType;
  label: string;
  value: number | undefined;
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
      prefix={coinType === CryptoTextFieldType.ALGO ? `🪙 ` : `🎴 `}
      label={label}
      decimalScale={decimals}
      customInput={TextField}
      isAllowed={(inputObj) => {
        console.log(inputObj);
        return Number(inputObj.value) <= maxValue;
      }}
      onValueChange={(values: NumberFormatValues) => {
        const value = values.floatValue;
        console.log(values);
        onChange(value);
      }}
      thousandSeparator={true}
      decimalSeparator={`.`}
    />
  );
};

export default CryptoTextField;
