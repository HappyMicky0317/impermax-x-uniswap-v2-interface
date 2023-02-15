/* eslint-disable no-invalid-this */
// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import ImpermaxRouter from '.';
import {
  Address,
  PoolTokenType
} from 'types/interfaces';

// Farming Shares
export async function initializeFarmingShares(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<number> {
  const farmingPool = await this.getFarmingPool(uniswapV2PairAddress, poolTokenType);
  if (!farmingPool) return 0;
  const { shares } = await farmingPool.recipients(this.account);
  return shares * 1;
}

export async function getFarmingShares(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.farmingShares) cache.farmingShares = this.initializeFarmingShares(uniswapV2PairAddress, poolTokenType);
  return cache.farmingShares;
}

// Claim Claimable
export async function initializeAvailableClaimable(
  this: ImpermaxRouter,
  claimableAddress: Address
) : Promise<number> {
  const claimable = await this.getClaimable(claimableAddress);
  return await claimable.claim() / 1e18;
}

export async function getAvailableClaimable(this: ImpermaxRouter, claimableAddress: Address) : Promise<number> {
  const cache = this.getClaimableCache(claimableAddress);
  if (!cache.availableClaimable) cache.availableClaimable = await this.initializeAvailableClaimable(claimableAddress);
  return cache.availableClaimable;
}

