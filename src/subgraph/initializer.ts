/* eslint-disable no-invalid-this */
// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import gql from 'graphql-tag';

import apolloFetcher from 'services/apollo-fetcher';

import {
  Address,
  PoolTokenType,
  LendingPoolData,
  UserData,
  CollateralPosition,
  SupplyPosition,
  BorrowPosition
} from 'types/interfaces';
import Subgraph from '.';
import {
  IMPERMAX_SUBGRAPH_URLS,
  UNISWAP_SUBGRAPH_URL,
  BLOCKLYTICS_SUBGRAPH_URL
} from 'config/web3/subgraphs';

const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;
const UNISWAP_FEE = 0.003;

async function fetchLendingPools(this: Subgraph): Promise<any[]> {
  const borrowableStr = `{
    id
    underlying {
      id
      symbol
      name
      decimals
      derivedUSD
    }
    totalBalance
    totalBorrows
    borrowRate
    reserveFactor
    kinkBorrowRate
    kinkUtilizationRate
    borrowIndex
    accrualTimestamp 
    exchangeRate 
    totalBalanceUSD
    totalSupplyUSD
    totalBorrowsUSD
    farmingPool {
      epochAmount
      epochBegin
      segmentLength
      vestingBegin
      sharePercentage
      distributor {
        id
      }
    }
  }`;

  const query = gql`{
    lendingPools(first: 1000, orderBy: totalBorrowsUSD, orderDirection: desc) {
      id
      borrowable0 ${borrowableStr}
      borrowable1 ${borrowableStr}
      collateral {
        id
        totalBalance
        totalBalanceUSD
        safetyMargin
        liquidationIncentive
        exchangeRate 
      }
      pair {
        reserve0
        reserve1
        reserveUSD
        token0Price
        token1Price
        derivedUSD
      }
    }
  }`;

  const impermaxSubgraphUrl = IMPERMAX_SUBGRAPH_URLS[this.chainId];
  const result = await apolloFetcher(impermaxSubgraphUrl, query);

  return result.data.lendingPools;
}

// Uniswap APY
async function fetchBlockByTimestamp(this: Subgraph, timestamp: number): Promise<number> {
  const query = gql`{
    blocks (first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }) {
      number
    }
  }`;
  const result = await apolloFetcher(BLOCKLYTICS_SUBGRAPH_URL, query);
  return result.data.blocks[0].number;
}

async function fetchPastVolume(this: Subgraph, uniswapV2PairAddresses: string[], seconds: number): Promise<{ [key in Address]: number }> {
  const timestamp = Math.floor((new Date()).getTime() / 1000);
  const blockNumber = await this.fetchBlockByTimestamp(timestamp - seconds);
  let addressString = '';
  for (const uniswapV2PairAddress of uniswapV2PairAddresses) {
    addressString += `"${uniswapV2PairAddress.toLowerCase()}",`;
  }
  const query = gql`{
    pairs ( block: {number: ${blockNumber}} where: { id_in: [${addressString}]} ) {
      id
      volumeUSD
    }
  }`;
  const result = await apolloFetcher(UNISWAP_SUBGRAPH_URL, query);
  const pastVolume: { [key in Address]: number } = {};
  for (const pair of result.data.pairs) {
    pastVolume[pair.id] = parseInt(pair.volumeUSD);
  }
  return pastVolume;
}

async function fetchCurrentVolumeAndReserves(this: Subgraph, uniswapV2PairAddresses: string[]): Promise<{
  currentVolume: { [key in Address]: number },
  currentReserve: { [key in Address]: number },
}> {
  let addressString = '';
  for (const uniswapV2PairAddress of uniswapV2PairAddresses) {
    addressString += `"${uniswapV2PairAddress.toLowerCase()}",`;
  }
  const query = gql`{
    pairs ( where: { id_in: [${addressString}]} ) {
      id
      reserveUSD
      volumeUSD
    }
  }`;
  const result = await apolloFetcher(UNISWAP_SUBGRAPH_URL, query);
  const currentVolume: { [key in Address]: number } = {};
  const currentReserve: { [key in Address]: number } = {};
  for (const pair of result.data.pairs) {
    currentVolume[pair.id] = parseInt(pair.volumeUSD);
    currentReserve[pair.id] = parseInt(pair.reserveUSD);
  }
  return { currentReserve, currentVolume };
}

async function fetchUniswapAPY(this: Subgraph, uniswapV2PairAddresses: string[], seconds: number = 60 * 60 * 24 * 7): Promise<{ [key in Address]: number }> {
  const pastVolume = await this.fetchPastVolume(uniswapV2PairAddresses, seconds);
  const { currentVolume, currentReserve } = await this.fetchCurrentVolumeAndReserves(uniswapV2PairAddresses);
  const uniswapAPY: { [key in Address]: number } = {};
  for (const uniswapV2PairAddress of uniswapV2PairAddresses) {
    if (!currentReserve[uniswapV2PairAddress]) {
      uniswapAPY[uniswapV2PairAddress] = 0;
      continue;
    }
    const cumVolumePast = pastVolume[uniswapV2PairAddress] ? pastVolume[uniswapV2PairAddress] : 0;
    const cumVolumeNow = currentVolume[uniswapV2PairAddress];
    const reserveUSD = currentReserve[uniswapV2PairAddress];
    const volumeUSD = cumVolumeNow - cumVolumePast;
    const yearlyVolume = volumeUSD * SECONDS_IN_YEAR / seconds;
    const yearlyFee = yearlyVolume * UNISWAP_FEE;
    uniswapAPY[uniswapV2PairAddress] = yearlyFee / reserveUSD;
  }
  return uniswapAPY;
}

async function initializeLendingPoolsData(this: Subgraph): Promise<{ [key in Address]?: LendingPoolData }> {
  const lendingPoolsData: { [key in Address]?: LendingPoolData } = {};
  try {
    const lendingPools = await this.fetchLendingPools();
    const uniswapV2PairAddresses = [];
    for (const lendingPool of lendingPools) {
      lendingPoolsData[lendingPool.id] = lendingPool;
      uniswapV2PairAddresses.push(lendingPool.id);
    }

    const uniswapAPY = await this.fetchUniswapAPY(uniswapV2PairAddresses);
    for (const lendingPool of lendingPools) {
      lendingPoolsData[lendingPool.id].pair.uniswapAPY = uniswapAPY[lendingPool.id];
    }
  } catch (error) {
    console.log('[initializeLendingPoolsData] error.message => ', error.message);
  }

  return lendingPoolsData;
}
async function getLendingPoolsData(this: Subgraph): Promise<{ [key in Address]: LendingPoolData }> {
  if (!this.lendingPoolsData) {
    this.lendingPoolsData = this.initializeLendingPoolsData();
  }

  return this.lendingPoolsData;
}
async function getLendingPoolData(
  this: Subgraph,
  uniswapV2PairAddress: Address
): Promise<LendingPoolData> {
  const lendingPoolsData = await this.getLendingPoolsData();
  const lowerCasedUniswapV2PairAddress = uniswapV2PairAddress.toLowerCase();
  const lendingPoolData = lendingPoolsData[lowerCasedUniswapV2PairAddress];

  return lendingPoolData;
}

// User Data
async function fetchUserData(this: Subgraph, account: Address): Promise<{
  collateralPositions: CollateralPosition[],
  supplyPositions: SupplyPosition[],
  borrowPositions: BorrowPosition[],
}> {
  const query = gql`{
    user(id: "${account.toLowerCase()}") {
      collateralPositions(first:1000) {
        balance
        collateral {
          lendingPool {
            id
          }
        }
      }
      supplyPositions(first:1000) {
        balance
        borrowable {
          underlying {
            id
          }
          lendingPool {
            id
          }
        }
      }
      borrowPositions(first:1000) {
        borrowBalance
        borrowIndex
        borrowable {
          underlying {
            id
          }
          lendingPool {
            id
          }
        }
      }
    }
  }`;
  const impermaxSubgraphUrl = IMPERMAX_SUBGRAPH_URLS[this.chainId];
  const result = await apolloFetcher(impermaxSubgraphUrl, query);
  return result.data.user;
}
async function initializeUserData(this: Subgraph, account: Address): Promise<UserData> {
  const result: UserData = {
    collateralPositions: {},
    supplyPositions: {},
    borrowPositions: {}
  };
  const data = await this.fetchUserData(account);
  if (!data) return null;
  for (const collateralPosition of data.collateralPositions) {
    result.collateralPositions[collateralPosition.collateral.lendingPool.id] = collateralPosition;
  }
  for (const supplyPositions of data.supplyPositions) {
    const uniswapV2PairAddress = supplyPositions.borrowable.lendingPool.id;
    const underlyingAddress = supplyPositions.borrowable.underlying.id;
    const addressA = await this.getUnderlyingAddress(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const poolTokenType = underlyingAddress === addressA ? PoolTokenType.BorrowableA : PoolTokenType.BorrowableB;
    if (!(uniswapV2PairAddress in result.supplyPositions)) result.supplyPositions[uniswapV2PairAddress] = {};
    result.supplyPositions[uniswapV2PairAddress][poolTokenType] = supplyPositions;
  }
  for (const borrowPositions of data.borrowPositions) {
    const uniswapV2PairAddress = borrowPositions.borrowable.lendingPool.id;
    const underlyingAddress = borrowPositions.borrowable.underlying.id;
    const addressA = await this.getUnderlyingAddress(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const poolTokenType = underlyingAddress === addressA ? PoolTokenType.BorrowableA : PoolTokenType.BorrowableB;
    if (!(uniswapV2PairAddress in result.borrowPositions)) result.borrowPositions[uniswapV2PairAddress] = {};
    result.borrowPositions[uniswapV2PairAddress][poolTokenType] = borrowPositions;
  }
  return result;
}
async function getUserData(this: Subgraph, account: Address): Promise<UserData> {
  if (!(account in this.usersData)) this.usersData[account] = this.initializeUserData(account);
  return this.usersData[account];
}

export {
  fetchLendingPools,
  fetchBlockByTimestamp,
  fetchPastVolume,
  fetchCurrentVolumeAndReserves,
  fetchUniswapAPY,
  initializeLendingPoolsData,
  getLendingPoolsData,
  getLendingPoolData,
  fetchUserData,
  initializeUserData,
  getUserData
};
