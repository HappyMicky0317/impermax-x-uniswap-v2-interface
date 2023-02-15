
import gql from 'graphql-tag';

import apolloFetcher from './apollo-fetcher';
import { IMPERMAX_SUBGRAPH_URLS } from 'config/web3/subgraphs';

interface TvlData {
  totalBalanceUSD: string;
  totalBorrowsUSD: string;
  totalSupplyUSD: string;
}

const query = gql`{
  impermaxFactories(first: 1) {
    totalBalanceUSD
    totalSupplyUSD
    totalBorrowsUSD
  }
}`;

/**
 * TODO:
 * - could be a hook
 * - could use SWR or react-query
 */

const getTVLData = async (chainID: number): Promise<TvlData> => {
  const impermaxSubgraphURL = IMPERMAX_SUBGRAPH_URLS[chainID];
  const result = await apolloFetcher(impermaxSubgraphURL, query);

  return result.data.impermaxFactories[0];
};

export type {
  TvlData
};

export default getTVLData;
