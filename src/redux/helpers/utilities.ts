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

export function capitalize(string: string): string {
  return string
    .split(` `)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(` `);
}

export function ellipseText(text = ``, maxLength = 9999): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + `...`;
  }
  return text;
}

export function ellipseAddress(address = ``, width = 6): string {
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export function formatBigNumWithDecimals(
  num: bigint,
  decimals: number,
): string {
  const singleUnit = BigInt(`1` + `0`.repeat(decimals));
  const wholeUnits = num / singleUnit;
  const fractionalUnits = num % singleUnit;

  return (
    wholeUnits.toString() +
    `.` +
    fractionalUnits.toString().padStart(decimals, `0`)
  );
}
