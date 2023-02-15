
import { Changes } from 'types/interfaces';

const getValuesFromPrice = (
  collateralDeposited: number,
  priceA: number,
  priceB: number,
  tokenABorrowed: number,
  tokenBBorrowed: number,
  changes: Changes = {
    changeCollateral: 0,
    changeBorrowedA: 0,
    changeBorrowedB: 0
  }
): {
  valueCollateral: number;
  valueA: number;
  valueB: number;
} => {
  const valueCollateralCandidate = collateralDeposited + changes.changeCollateral;
  const amountA = tokenABorrowed + changes.changeBorrowedA;
  const amountB = tokenBBorrowed + changes.changeBorrowedB;
  const valueACandidate = amountA * priceA;
  const valueBCandidate = amountB * priceB;

  return {
    valueCollateral: valueCollateralCandidate > 0 ? valueCollateralCandidate : 0,
    valueA: valueACandidate > 0 ? valueACandidate : 0,
    valueB: valueBCandidate > 0 ? valueBCandidate : 0
  };
};

export default getValuesFromPrice;
