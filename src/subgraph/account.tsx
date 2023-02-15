/* eslint-disable no-invalid-this */
// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { Address, PoolTokenType } from '../types/interfaces';
import Subgraph from '.';

export async function getBorrowPositions(this: Subgraph, account: Address) : Promise<Address[]> {
  const userData = await this.getUserData(account);
  if (!userData) return [];
  return Object.keys(userData.collateralPositions);
}

export async function getSupplyPositions(this: Subgraph, account: Address) : Promise<Address[]> {
  const userData = await this.getUserData(account);
  if (!userData) return [];
  return Object.keys(userData.supplyPositions);
}

export async function getCollateralAmount(this: Subgraph, account: Address, uniswapV2PairAddress: Address) : Promise<number> {
  const userData = await this.getUserData(account);
  if (userData && userData.collateralPositions[uniswapV2PairAddress]) {
    const exchangeRate = await this.getExchangeRate(uniswapV2PairAddress, PoolTokenType.Collateral);
    const collateralBalance = parseFloat(userData.collateralPositions[uniswapV2PairAddress].balance);
    return collateralBalance * exchangeRate;
  }
  return 0;
}

export async function getCollateralValue(this: Subgraph, account: Address, uniswapV2PairAddress: Address) : Promise<number> {
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, PoolTokenType.Collateral);
  const collateralAmount = await this.getCollateralAmount(account, uniswapV2PairAddress);
  return collateralAmount * tokenPrice;
}

export async function getBorrowedAmount(this: Subgraph, account: Address, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const userData = await this.getUserData(account);
  const borrowIndex = await this.getBorrowIndex(uniswapV2PairAddress, poolTokenType);
  if (userData && userData.borrowPositions[uniswapV2PairAddress] && userData.borrowPositions[uniswapV2PairAddress][poolTokenType]) {
    const borrowPosition = userData.borrowPositions[uniswapV2PairAddress][poolTokenType];
    const borrowBalance = parseFloat(borrowPosition.borrowBalance);
    const userBorrowIndex = parseFloat(borrowPosition.borrowIndex);
    return borrowBalance * borrowIndex / userBorrowIndex;
  }
  return 0;
}

export async function getBorrowedValue(this: Subgraph, account: Address, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  const borrowedAmount = await this.getBorrowedAmount(account, uniswapV2PairAddress, poolTokenType);
  return borrowedAmount * tokenPrice;
}

export async function getBorrowerEquityValue(this: Subgraph, account: Address, uniswapV2PairAddress: Address) : Promise<number> {
  const collateralValue = await this.getCollateralValue(account, uniswapV2PairAddress);
  const borrowedValueA = await this.getBorrowedValue(account, uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const borrowedValueB = await this.getBorrowedValue(account, uniswapV2PairAddress, PoolTokenType.BorrowableB);
  return collateralValue - borrowedValueA - borrowedValueB;
}

export async function getSuppliedAmount(this: Subgraph, account: Address, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const userData = await this.getUserData(account);
  if (userData && userData.supplyPositions[uniswapV2PairAddress] && userData.supplyPositions[uniswapV2PairAddress][poolTokenType]) {
    const exchangeRate = await this.getExchangeRate(uniswapV2PairAddress, poolTokenType);
    const supplyBalance = parseFloat(userData.supplyPositions[uniswapV2PairAddress][poolTokenType].balance);
    return supplyBalance * exchangeRate;
  }
  return 0;
}

export async function getSuppliedValue(this: Subgraph, account: Address, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  const suppliedAmount = await this.getSuppliedAmount(account, uniswapV2PairAddress, poolTokenType);
  return suppliedAmount * tokenPrice;
}

export async function getAccountTotalValueLocked(this: Subgraph, account: Address) : Promise<number> {
  const borrowPositions = await this.getBorrowPositions(account);
  const supplyPositions = await this.getSupplyPositions(account);
  let tvl = 0;
  for (const uniswapV2PairAddress of borrowPositions) {
    tvl += await this.getBorrowerEquityValue(account, uniswapV2PairAddress);
  }
  for (const uniswapV2PairAddress of supplyPositions) {
    tvl += await this.getSuppliedValue(account, uniswapV2PairAddress, PoolTokenType.BorrowableA);
    tvl += await this.getSuppliedValue(account, uniswapV2PairAddress, PoolTokenType.BorrowableB);
  }
  return tvl;
}

export async function getAccountTotalValueSupplied(this: Subgraph, account: Address) : Promise<number> {
  const supplyPositions = await this.getSupplyPositions(account);
  let tvl = 0;
  for (const uniswapV2PairAddress of supplyPositions) {
    tvl += await this.getSuppliedValue(account, uniswapV2PairAddress, PoolTokenType.BorrowableA);
    tvl += await this.getSuppliedValue(account, uniswapV2PairAddress, PoolTokenType.BorrowableB);
  }
  return tvl;
}

export async function getAccountTotalValueBorrowed(this: Subgraph, account: Address) : Promise<number> {
  const borrowPositions = await this.getBorrowPositions(account);
  let tvl = 0;
  for (const uniswapV2PairAddress of borrowPositions) {
    tvl += await this.getBorrowedValue(account, uniswapV2PairAddress, PoolTokenType.BorrowableA);
    tvl += await this.getBorrowedValue(account, uniswapV2PairAddress, PoolTokenType.BorrowableB);
  }
  return tvl;
}
