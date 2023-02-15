
import gql from 'graphql-tag';

import apolloFetcher from './apollo-fetcher';
import { IMPERMAX_SUBGRAPH_URLS } from 'config/web3/subgraphs';
import { LendingPoolData } from 'types/interfaces';

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

// TODO: `1000` is hardcoded
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

const getLendingPools = async (chainID: number): Promise<Array<LendingPoolData>> => {
  const impermaxSubgraphURL = IMPERMAX_SUBGRAPH_URLS[chainID];
  const result = await apolloFetcher(impermaxSubgraphURL, query);

  return result.data.lendingPools;
};

export type {
  LendingPoolData
};

export default getLendingPools;
