
import gql from 'graphql-tag';

import apolloFetcher from './apollo-fetcher';
import { IMX_STAKING_SUBGRAPH_URLS } from 'config/web3/subgraphs';

const query = gql`{
  ximxes(first: 1) {
    totalSupply
    totalBalance
    exchangeRate
    dailyAPR
  }
}`;

interface XIMXData {
  totalSupply: string;
  totalBalance: string;
  exchangeRate: string;
  dailyAPR: string;
}

const getXIMXData = async (chainID: number): Promise<XIMXData> => {
  const impermaxSubgraphURL = IMX_STAKING_SUBGRAPH_URLS[chainID];
  const result = await apolloFetcher(impermaxSubgraphURL, query);

  return result.data.ximxes[0];
};

export type {
  XIMXData
};

export default getXIMXData;
