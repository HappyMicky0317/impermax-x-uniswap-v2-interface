
import getValuesFromPrice from 'utils/helpers/get-values-from-price';

const getMaxDeleverage = (
  collateralDeposited: number,
  tokenAMarketDenomLPPrice: number,
  tokenBMarketDenomLPPrice: number,
  tokenABorrowed: number,
  tokenBBorrowed: number,
  slippage: number
): number => {
  const {
    valueCollateral,
    valueA,
    valueB
  } = getValuesFromPrice(
    collateralDeposited,
    tokenAMarketDenomLPPrice,
    tokenBMarketDenomLPPrice,
    tokenABorrowed,
    tokenBBorrowed
  );
  const minRepayPerSide = valueCollateral / 2 / Math.sqrt(1 + slippage / 100);
  let maxDeleverage;
  if (minRepayPerSide >= valueA && minRepayPerSide >= valueB) {
    maxDeleverage = collateralDeposited;
  }
  if (minRepayPerSide * 2 < valueA + valueB) {
    maxDeleverage = 0;
  }
  maxDeleverage = Math.min(valueA, valueB) * 2 * Math.sqrt(1 + slippage / 100);

  return maxDeleverage;
};

export default getMaxDeleverage;
