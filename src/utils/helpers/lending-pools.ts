
import { getAddress } from '@ethersproject/address';

import { W_ETH_ADDRESSES } from 'config/web3/contracts/w-eths';
import toAPY from 'utils/helpers/to-apy';
import {
  PoolTokenType,
  LendingPoolData
} from 'types/interfaces';

const getLendingPoolTokenName = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB,
  chainID: number
): string => {
  const wETHAddress = W_ETH_ADDRESSES[chainID];
  const lowerCasedWETHAddress = wETHAddress.toLowerCase();
  const underlyingAddress = lendingPool[poolTokenType].underlying.id;

  if (underlyingAddress === lowerCasedWETHAddress) {
    return 'Ethereum';
  } else {
    return lendingPool[poolTokenType].underlying.name;
  }
};

// TODO: double-check with `useSymbol`
const getLendingPoolTokenSymbol = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType,
  chainID: number
): string => {
  if (poolTokenType === PoolTokenType.Collateral) {
    const symbolA = getLendingPoolTokenSymbol(lendingPool, PoolTokenType.BorrowableA, chainID);
    const symbolB = getLendingPoolTokenSymbol(lendingPool, PoolTokenType.BorrowableB, chainID);

    return `${symbolA}-${symbolB}`;
  }

  const wETHAddress = W_ETH_ADDRESSES[chainID];
  const lowerCasedWETHAddress = wETHAddress.toLowerCase();
  const underlyingAddress = lendingPool[poolTokenType].underlying.id;

  if (underlyingAddress === lowerCasedWETHAddress) {
    return 'ETH';
  } else {
    return lendingPool[poolTokenType].underlying.symbol;
  }
};

const getLendingPoolTokenTotalSupplyInUSD = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
): number => {
  const totalBalance = parseFloat(lendingPool[poolTokenType].totalBalance);
  const totalBorrows = parseFloat(lendingPool[poolTokenType].totalBorrows);
  const supply = totalBalance + totalBorrows;
  const utilizationRate = supply === 0 ? 0 : totalBorrows / supply;

  const borrowRate = parseFloat(lendingPool[poolTokenType].borrowRate);
  const reserveFactor = parseFloat(lendingPool[poolTokenType].reserveFactor);
  const supplyRate = borrowRate * utilizationRate * (1 - reserveFactor); // TODO: could be a function

  const accrualTimestamp = parseFloat(lendingPool[poolTokenType].accrualTimestamp);
  const currentTotalSupply = supply * (1 + (Date.now() / 1000 - accrualTimestamp) * supplyRate);
  const tokenPriceInUSD = getLendingPoolTokenPriceInUSD(lendingPool, poolTokenType);

  return currentTotalSupply * tokenPriceInUSD;
};

const getLendingPoolTokenTotalBorrowInUSD = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
): number => {
  const totalBorrows = parseFloat(lendingPool[poolTokenType].totalBorrows);
  const accrualTimestamp = parseFloat(lendingPool[poolTokenType].accrualTimestamp);
  const borrowRate = parseFloat(lendingPool[poolTokenType].borrowRate);
  const currentTotalBorrow = totalBorrows * (1 + (Date.now() / 1000 - accrualTimestamp) * borrowRate);
  const tokenPriceInUSD = getLendingPoolTokenPriceInUSD(lendingPool, poolTokenType);

  // TODO: it's also from lendingPool[poolTokenType].totalBorrowsUSD. What is different?
  return currentTotalBorrow * tokenPriceInUSD;
};

const getLendingPoolTokenUtilizationRate = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
): number => {
  const totalBalance = parseFloat(lendingPool[poolTokenType].totalBalance);
  const totalBorrows = parseFloat(lendingPool[poolTokenType].totalBorrows);
  const supply = totalBalance + totalBorrows;

  return supply === 0 ? 0 : totalBorrows / supply;
};

const getLendingPoolTokenSupplyAPY = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
): number => {
  const utilizationRate = getLendingPoolTokenUtilizationRate(lendingPool, poolTokenType);

  const borrowRate = parseFloat(lendingPool[poolTokenType].borrowRate);
  const reserveFactor = parseFloat(lendingPool[poolTokenType].reserveFactor);
  const supplyRate = borrowRate * utilizationRate * (1 - reserveFactor); // TODO: could be a function

  return toAPY(supplyRate);
};

const getLendingPoolTokenBorrowAPY = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
): number => {
  const borrowRate = parseFloat(lendingPool[poolTokenType].borrowRate);

  return toAPY(borrowRate);
};

const getLendingPoolTokenIconPath = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
): string => {
  const underlyingAddress = lendingPool[poolTokenType].underlying.id;
  const convertedUnderlyingAddress = getAddress(underlyingAddress);

  return `/assets/images/token-logos/${convertedUnderlyingAddress}.png`;
};

const getLendingPoolTokenPriceInUSD = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType
): number => {
  switch (poolTokenType) {
  case PoolTokenType.BorrowableA:
  case PoolTokenType.BorrowableB:
    return parseFloat(lendingPool[poolTokenType].underlying.derivedUSD);
  case PoolTokenType.Collateral:
    return parseFloat(lendingPool.pair.derivedUSD);
  }
};

export {
  getLendingPoolTokenName,
  getLendingPoolTokenSymbol,
  getLendingPoolTokenTotalSupplyInUSD,
  getLendingPoolTokenTotalBorrowInUSD,
  getLendingPoolTokenUtilizationRate,
  getLendingPoolTokenSupplyAPY,
  getLendingPoolTokenBorrowAPY,
  getLendingPoolTokenIconPath,
  getLendingPoolTokenPriceInUSD
};
