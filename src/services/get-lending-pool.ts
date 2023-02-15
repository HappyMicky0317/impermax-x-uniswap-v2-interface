
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

const getLendingPool = async (
  chainID: number,
  lowerCasedUniswapV2PairAddress: string
): Promise<LendingPoolData> => {
  const query = gql`{
    lendingPool(id: "${lowerCasedUniswapV2PairAddress}") {
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

  const impermaxSubgraphURL = IMPERMAX_SUBGRAPH_URLS[chainID];
  const result = await apolloFetcher(impermaxSubgraphURL, query);

  return result.data.lendingPool;
};

export type {
  LendingPoolData
};

export default getLendingPool;
