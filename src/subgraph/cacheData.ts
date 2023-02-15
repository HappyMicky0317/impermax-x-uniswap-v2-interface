/* eslint-disable no-invalid-this */
import { Address, PoolTokenType, Borrowable } from '../types/interfaces';
import Subgraph from '.';
import { IMX_ADDRESSES } from 'config/web3/contracts/imxes';
import { W_ETH_ADDRESSES } from 'config/web3/contracts/w-eths';
import { UNISWAP_V2_FACTORY_ADDRESSES } from 'config/web3/contracts/uniswap-v2-factories';
import toAPY from 'utils/helpers/to-apy';
import getPairAddress from 'utils/helpers/web3/get-pair-address';

// Symbol
export async function getSymbol(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  if (poolTokenType === PoolTokenType.Collateral) {
    const symbolA = await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const symbolB = await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableB);
    return symbolA + '-' + symbolB;
  }
  const underlying = await this.getUnderlyingAddress(uniswapV2PairAddress, poolTokenType);
  const wETHAddress = W_ETH_ADDRESSES[this.chainId];
  if (underlying === wETHAddress.toLowerCase()) return 'ETH';
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return lendingPoolData[poolTokenType].underlying.symbol;
}

// Decimals
export async function getDecimals(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  if (poolTokenType === PoolTokenType.Collateral) return 18;
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseInt(lendingPoolData[poolTokenType].underlying.decimals);
}

// ExchangeRate
export async function getExchangeRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat(lendingPoolData[poolTokenType].exchangeRate);
}

// Underlying Address
export async function getUnderlyingAddress(
  this: Subgraph,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<Address> {
  if (poolTokenType === PoolTokenType.Collateral) return uniswapV2PairAddress;

  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);

  return lendingPoolData[poolTokenType].underlying.id;
}

// Token price
export async function getTokenPrice(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  if (poolTokenType === PoolTokenType.Collateral) {
    return parseFloat(lendingPoolData.pair.derivedUSD);
  }
  return parseFloat((lendingPoolData[poolTokenType] as Borrowable).underlying.derivedUSD);
}
// ray test touch <
export async function getImxPrice(this: Subgraph) : Promise<number> {
  const imxAddress = IMX_ADDRESSES[this.chainId];
  const wETHAddress = W_ETH_ADDRESSES[this.chainId];
  const uniswapV2FactoryAddress = UNISWAP_V2_FACTORY_ADDRESSES[this.chainId];
  const imxPair = getPairAddress(wETHAddress, imxAddress, uniswapV2FactoryAddress);
  const aAddress = await this.getUnderlyingAddress(imxPair, PoolTokenType.BorrowableA);
  const poolTokenType = aAddress.toLowerCase() === imxAddress.toLowerCase() ? PoolTokenType.BorrowableA : PoolTokenType.BorrowableB;
  return this.getTokenPrice(imxPair, poolTokenType);
}
// ray test touch >

// Total balance
export async function getTotalBalance(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat(lendingPoolData[poolTokenType].totalBalance);
}
export async function getTotalBalanceUSD(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat(lendingPoolData[poolTokenType].totalBalanceUSD);
}

// Reserve Factor
export async function getReserveFactor(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as Borrowable).reserveFactor);
}

// Kink Borrow Rate
export async function getKinkBorrowRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as Borrowable).kinkBorrowRate);
}

// Kink Utilization Rate
export async function getKinkUtilizationRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as Borrowable).kinkUtilizationRate);
}

// Borrow Index
export async function getBorrowIndex(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as Borrowable).borrowIndex);
}

// Accrue Timestamp
export async function getAccrualTimestamp(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as Borrowable).accrualTimestamp);
}

// Total borrows
export async function getTotalBorrows(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as Borrowable).totalBorrows);
}
// ray test touch <
export async function getCurrentTotalBorrows(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const totalBorrows = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  const accrualTimestamp = await this.getAccrualTimestamp(uniswapV2PairAddress, poolTokenType);
  const borrowRate = await this.getBorrowRate(uniswapV2PairAddress, poolTokenType);
  return totalBorrows * (1 + (Date.now() / 1000 - accrualTimestamp) * borrowRate);
}
export async function getTotalBorrowsUSD(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const totalBorrows = await this.getCurrentTotalBorrows(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  return totalBorrows * tokenPrice;
}
// ray test touch >

// Borrow rate
export async function getBorrowRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as Borrowable).borrowRate);
}
export async function getNextBorrowRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, borrowAmount: number) : Promise<number> {
  const totalBorrows = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  const supply = await this.getSupply(uniswapV2PairAddress, poolTokenType);
  const utilizationRate = (borrowAmount + totalBorrows) / supply;
  const kinkBorrowRate = await this.getKinkBorrowRate(uniswapV2PairAddress, poolTokenType);
  const kinkUtilizationRate = await this.getKinkUtilizationRate(uniswapV2PairAddress, poolTokenType);
  if (utilizationRate < kinkUtilizationRate) return utilizationRate / kinkUtilizationRate * kinkBorrowRate;
  return ((utilizationRate - kinkUtilizationRate) / (1 - kinkUtilizationRate) * 4 + 1) * kinkBorrowRate;
}
export async function getNextBorrowAPY(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, borrowAmount: number) : Promise<number> {
  const borrowRate = await this.getNextBorrowRate(uniswapV2PairAddress, poolTokenType, borrowAmount);
  return toAPY(borrowRate);
}

// Supply
export async function getSupply(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const totalBalance = await this.getTotalBalance(uniswapV2PairAddress, poolTokenType);
  const totalBorrows = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  return totalBalance + totalBorrows;
}

// Utilization Rate
export async function getUtilizationRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const supply = await this.getSupply(uniswapV2PairAddress, poolTokenType);
  if (supply === 0) return 0;
  const totalBorrows = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  return totalBorrows / supply;
}

// Supply Rate
export async function getNextSupplyRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, supplyAmount: number) : Promise<number> {
  const totalBorrows = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  const supply = await this.getSupply(uniswapV2PairAddress, poolTokenType);
  const utilizationRate = totalBorrows / (supply + supplyAmount);
  const kinkBorrowRate = await this.getKinkBorrowRate(uniswapV2PairAddress, poolTokenType);
  const kinkUtilizationRate = await this.getKinkUtilizationRate(uniswapV2PairAddress, poolTokenType);
  const reserveFactor = await this.getReserveFactor(uniswapV2PairAddress, poolTokenType);
  if (utilizationRate < kinkUtilizationRate) return utilizationRate / kinkUtilizationRate * kinkBorrowRate * utilizationRate * (1 - reserveFactor);
  return ((utilizationRate - kinkUtilizationRate) / (1 - kinkUtilizationRate) * 4 + 1) * kinkBorrowRate * utilizationRate * (1 - reserveFactor);
}
export async function getNextSupplyAPY(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, supplyAmount: number) : Promise<number> {
  const supplyRate = await this.getNextSupplyRate(uniswapV2PairAddress, poolTokenType, supplyAmount);
  return toAPY(supplyRate);
}

// Uniswap APY
export async function getUniswapAPY(this: Subgraph, uniswapV2PairAddress: Address) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return lendingPoolData.pair.uniswapAPY;
}

// ray test touch <
// Reward Speed
export async function getRewardSpeed(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  const farmingPoolData = (lendingPoolData[poolTokenType] as Borrowable).farmingPool;
  if (farmingPoolData === null) return 0;
  const segmentLength = parseInt(farmingPoolData.segmentLength);
  const epochBegin = parseInt(farmingPoolData.epochBegin);
  const epochAmount = parseFloat(farmingPoolData.epochAmount);
  const epochEnd = epochBegin + segmentLength;
  const timestamp = (new Date()).getTime() / 1000;
  if (timestamp > epochEnd) {
    // How to manage better this case? Maybe check shares on distributor
    return 0;
  }
  return epochAmount / segmentLength;
}
// ray test touch >

// ray test touch <
// Farming
export async function getNextFarmingAPY(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, borrowAmount: number) : Promise<number> {
  const imxPrice = await this.getImxPrice();
  const rewardSpeed = await this.getRewardSpeed(uniswapV2PairAddress, poolTokenType);
  const totalBorrowsUSD = await this.getTotalBorrowsUSD(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  const additionalBorrowsUSD = borrowAmount * tokenPrice;
  const totalBorrowedUSD = totalBorrowsUSD + additionalBorrowsUSD;
  if (totalBorrowedUSD === 0) return 0;
  return toAPY(imxPrice * rewardSpeed / totalBorrowedUSD);
}
// ray test touch >
