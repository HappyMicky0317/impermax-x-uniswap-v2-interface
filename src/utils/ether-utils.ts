import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { BigNumber } from '@ethersproject/bignumber';
import { formatToDecimals } from './format';

export function balanceToDecimal(s: string): string {
  return formatUnits(s);
}

export function decimalToBalance(d: string | number, decimals = 18): BigNumber {
  const n = parseFloat(d.toString());
  const s = formatToDecimals(Math.max(n, 0), decimals);
  return parseUnits(s, decimals);
}

export function address(n: number): string {
  return `0x${n.toString(16).padStart(40, '0')}`;
}
