
import formatNumberWithComma from './format-number-with-comma';
import formatNumberWithFixedDecimals from './format-number-with-fixed-decimals';

// MEMO: inspired by https://medium.com/javascript-scene/curry-and-function-composition-2c208d774983
// TODO: should type properly
const pipe = (...fns: any[]) => (x: any) => fns.reduce((y, f) => f(y), x);

const formatNumberWithPrefix = (prefix: string) => (value: number | string): string => {
  return `${prefix}${value}`;
};

const formatNumberWithUSDCommaDecimals = pipe(
  formatNumberWithFixedDecimals(2),
  formatNumberWithComma,
  formatNumberWithPrefix('$')
);

const formatWithPercentage = (value: number) => value * 100;

const formatNumberWithPercentageCommaDecimals = pipe(
  formatWithPercentage,
  formatNumberWithFixedDecimals(2),
  formatNumberWithComma,
  formatNumberWithPrefix('%')
);

const formatNumberWithCommaDecimals = pipe(
  formatNumberWithFixedDecimals(2),
  formatNumberWithComma
);

export {
  formatNumberWithUSDCommaDecimals,
  formatNumberWithPercentageCommaDecimals,
  formatNumberWithCommaDecimals
};
