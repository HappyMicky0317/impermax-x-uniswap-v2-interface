
import getValuesFromPrice from 'utils/helpers/get-values-from-price';
import { Changes } from 'types/interfaces';

const getLeverage = (
  collateralDeposited: number,
  tokenADenomLPPrice: number,
  tokenBDenomLPPrice: number,
  tokenABorrowed: number,
  tokenBBorrowed: number,
  changes: Changes = {
    changeBorrowedA: 0,
    changeBorrowedB: 0,
    changeCollateral: 0
  }
): number => {
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

  const valueDebt = valueA + valueB;
  if (valueDebt === 0) return 1;

  const equity = valueCollateral - valueDebt;
  if (equity <= 0) return Infinity;

  return valueDebt / equity + 1;
};

export default getLeverage;
