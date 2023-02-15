
import getValuesFromPrice from 'utils/helpers/get-values-from-price';
import { Changes } from 'types/interfaces';

const getLiquidationPrices = (
  collateralDeposited: number,
  tokenADenomLPPrice: number,
  tokenBDenomLPPrice: number,
  tokenABorrowed: number,
  tokenBBorrowed: number,
  twapPrice: number,
  safetyMargin: number,
  liquidationIncentive: number,
  changes: Changes = {
    changeCollateral: 0,
    changeBorrowedA: 0,
    changeBorrowedB: 0
  }
): [
  number,
  number
] => {
  const {
    valueCollateral,
    valueA,
    valueB
  } = getValuesFromPrice(
    collateralDeposited,
    tokenADenomLPPrice,
    tokenBDenomLPPrice,
    tokenABorrowed,
    tokenBBorrowed,
    changes
  );

  let tokenAPriceSwing;
  let tokenBPriceSwing;
  if (valueA + valueB === 0) {
    tokenAPriceSwing = Infinity;
    tokenBPriceSwing = Infinity;
  }
  const actualCollateral = valueCollateral / liquidationIncentive;
  const rad = Math.sqrt(actualCollateral ** 2 - 4 * valueA * valueB);
  if (!rad) {
    tokenAPriceSwing = 0;
    tokenBPriceSwing = 0;
  }
  const t = (actualCollateral + rad) / (2 * Math.sqrt(safetyMargin));
  tokenAPriceSwing = (t / valueA) ** 2;
  tokenBPriceSwing = (t / valueB) ** 2;

  // ray test touch <<
  // TODO: this.priceInverted === true
  // const price0 = twapPrice / tokenAPriceSwing;
  // const price1 = twapPrice * tokenBPriceSwing;
  // ray test touch >>
  const price0 = twapPrice / tokenBPriceSwing;
  const price1 = twapPrice * tokenAPriceSwing;

  return [
    price0,
    price1
  ];
};

export default getLiquidationPrices;

