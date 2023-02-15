/* eslint-disable no-invalid-this */
// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { formatUnits } from '@ethersproject/units';

import ImpermaxRouter from '.';
import {
  Address,
  PoolTokenType
} from '../types/interfaces';
import { W_ETH_ADDRESSES } from 'config/web3/contracts/w-eths';
import { DUST } from 'config/general';

// Exchange rate
export async function initializeExchangeRate(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<number> {
  const [poolToken] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const exchangeRate = await poolToken.callStatic.exchangeRate();

  return exchangeRate / 1e18;
}

export async function getExchangeRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.exchangeRate) cache.exchangeRate = this.initializeExchangeRate(uniswapV2PairAddress, poolTokenType);
  return cache.exchangeRate;
}

// Token Available Balance
export async function initializeTokenBalance(
  this: ImpermaxRouter,
  tokenAddress: Address
) : Promise<number> {
  const token = await this.getToken(tokenAddress);
  const wETHAddress = W_ETH_ADDRESSES[this.chainId];
  if (token.address === wETHAddress) {
    const bigBalance = await this.library.getBalance(this.account);
    return parseFloat(formatUnits(bigBalance)) / DUST;
  }
  const balance = await token.balanceOf(this.account);
  return (await this.normalizeToken(tokenAddress, balance)) / DUST;
}
export async function getTokenBalance(
  this: ImpermaxRouter,
  tokenAddress: Address
) : Promise<number> {
  const cache = this.getTokenCache(tokenAddress);
  if (!cache.balance) {
    cache.balance = this.initializeTokenBalance(tokenAddress);
  }
  return cache.balance;
}
export async function getAvailableBalance(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<number> {
  const tokenAddress = await this.getTokenAddress(uniswapV2PairAddress, poolTokenType);
  return this.getTokenBalance(tokenAddress);
}

// Borrowed
export async function initializeBorrowed(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<number> {
  const [borrowable] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const balance = await borrowable.borrowBalance(this.account);
  const storedAmount = await this.normalize(uniswapV2PairAddress, poolTokenType, balance);
  const accrualTimestamp = await this.subgraph.getAccrualTimestamp(uniswapV2PairAddress, poolTokenType);
  const borrowRate = await this.subgraph.getBorrowRate(uniswapV2PairAddress, poolTokenType);
  return storedAmount * (1 + (Date.now() / 1000 - accrualTimestamp) * borrowRate);
}
export async function getBorrowed(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.borrowed) cache.borrowed = this.initializeBorrowed(uniswapV2PairAddress, poolTokenType);
  return cache.borrowed;
}
