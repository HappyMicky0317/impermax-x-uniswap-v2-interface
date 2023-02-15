/* eslint-disable no-invalid-this */
// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import ImpermaxRouter from '.';
import {
  Address,
  LendingPool,
  PoolTokenType,
  Contract,
  FarmingPoolContract,
  ClaimableContract,
  ERC20Contract
} from '../types/interfaces';

export function getLendingPoolCache(this: ImpermaxRouter, uniswapV2PairAddress: Address) {
  if (!(uniswapV2PairAddress in this.lendingPoolCache)) {
    this.lendingPoolCache[uniswapV2PairAddress] = {};
  }
  return this.lendingPoolCache[uniswapV2PairAddress];
}

export async function initializeLendingPool(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address
) : Promise<LendingPool> {
  const lPool = await this.router.getLendingPool(uniswapV2PairAddress);
  const uniswapV2Pair = this.newUniswapV2Pair(uniswapV2PairAddress);
  const tokenAAddress = await uniswapV2Pair.token0();
  const tokenBAddress = await uniswapV2Pair.token1();
  const borrowableA = this.newBorrowable(lPool.borrowableA);
  const borrowableB = this.newBorrowable(lPool.borrowableB);
  const farmingPoolAAddress = await borrowableA.borrowTracker();
  const farmingPoolBAddress = await borrowableB.borrowTracker();

  return {
    uniswapV2Pair,
    tokenA: this.newERC20(tokenAAddress),
    tokenB: this.newERC20(tokenBAddress),
    collateral: this.newCollateral(lPool.collateral),
    borrowableA,
    borrowableB,
    farmingPoolA:
      farmingPoolAAddress === '0x0000000000000000000000000000000000000000' ? // TODO: hardcoded
        null :
        this.newFarmingPool(farmingPoolAAddress),
    farmingPoolB:
      farmingPoolBAddress === '0x0000000000000000000000000000000000000000' ? // TODO: hardcoded
        null :
        this.newFarmingPool(farmingPoolBAddress)
  };
}

export async function getLendingPool(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<LendingPool> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.lendingPool) {
    cache.lendingPool = this.initializeLendingPool(uniswapV2PairAddress);
  }
  return cache.lendingPool;
}

export async function getContracts(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<[Contract, Contract]> {
  const lendingPool = await this.getLendingPool(uniswapV2PairAddress);

  if (poolTokenType === PoolTokenType.BorrowableA) {
    return [
      lendingPool.borrowableA,
      lendingPool.tokenA
    ];
  }

  if (poolTokenType === PoolTokenType.BorrowableB) {
    return [
      lendingPool.borrowableB,
      lendingPool.tokenB
    ];
  }

  return [
    lendingPool.collateral,
    lendingPool.uniswapV2Pair
  ];
}

export async function getPoolToken(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<Contract> {
  const [poolToken] = await this.getContracts(uniswapV2PairAddress, poolTokenType);

  return poolToken;
}

export async function getFarmingPool(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<FarmingPoolContract> {
  const lendingPool = await this.getLendingPool(uniswapV2PairAddress);

  if (poolTokenType === PoolTokenType.BorrowableA) {
    return lendingPool.farmingPoolA;
  }

  if (poolTokenType === PoolTokenType.BorrowableB) {
    return lendingPool.farmingPoolB;
  }

  return null;
}

// Claimable
export function getClaimableCache(this: ImpermaxRouter, claimableAddress: Address) {
  if (!(claimableAddress in this.claimableCache)) {
    this.claimableCache[claimableAddress] = {};
  }
  return this.claimableCache[claimableAddress];
}
export async function initializeClaimable(
  this: ImpermaxRouter,
  claimableAddress: Address
) : Promise<ClaimableContract> {
  return this.newClaimable(claimableAddress);
}
export async function getClaimable(
  this: ImpermaxRouter,
  claimableAddress: Address
) : Promise<ClaimableContract> {
  const cache = this.getClaimableCache(claimableAddress);
  if (!cache.contract) cache.contract = this.initializeClaimable(claimableAddress);
  return cache.contract;
}

// Token
export function getTokenCache(this: ImpermaxRouter, tokenAddress: Address) {
  if (!(tokenAddress in this.tokenCache)) {
    this.tokenCache[tokenAddress] = {};
  }
  return this.tokenCache[tokenAddress];
}
export async function initializeToken(
  this: ImpermaxRouter,
  tokenAddress: Address
) : Promise<ERC20Contract> {
  return this.newERC20(tokenAddress);
}
export async function getToken(
  this: ImpermaxRouter,
  tokenAddress: Address
) : Promise<ERC20Contract> {
  const cache = this.getTokenCache(tokenAddress);
  if (!cache.contract) cache.contract = this.initializeToken(tokenAddress);
  return cache.contract;
}

// Address
export async function getPoolTokenAddress(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<string> {
  const [poolToken] = await this.getContracts(uniswapV2PairAddress, poolTokenType);

  return poolToken.address;
}

export async function getTokenAddress(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<string> {
  const [, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);

  return token.address;
}
