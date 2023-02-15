
import gql from 'graphql-tag';

import apolloFetcher from './apollo-fetcher';
import { IMX_STAKING_SUBGRAPH_URLS } from 'config/web3/subgraphs';

interface StakingUserData {
  ximxBalance: string;
  lastExchangeRate: string;
  totalEarned: string;
}

const getStakingUserData = async (chainID: number, account: string): Promise<StakingUserData> => {
  const query = gql`{
    user(id: "${account.toLowerCase()}") {
      ximxBalance
      lastExchangeRate
      totalEarned
    }
  }`;

  const impermaxSubgraphURL = IMX_STAKING_SUBGRAPH_URLS[chainID];
  const result = await apolloFetcher(impermaxSubgraphURL, query);

  return result.data.user;
};

export type {
  StakingUserData
};

export default getStakingUserData;
