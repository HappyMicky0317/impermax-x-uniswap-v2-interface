
import gql from 'graphql-tag';

import apolloFetcher from './apollo-fetcher';
import { IMX_STAKING_SUBGRAPH_URLS } from 'config/web3/subgraphs';

const query = gql`{
  reservesDistributors(first:1) {
    balance
    periodLength
    lastClaim
    distributed
  }
}`;

const getReservesDistributorData = async (chainID: number): Promise<ReservesDistributorData> => {
  const impermaxSubgraphURL = IMX_STAKING_SUBGRAPH_URLS[chainID];
  const result = await apolloFetcher(impermaxSubgraphURL, query);

  return result.data.reservesDistributors[0];
};

export interface ReservesDistributorData {
  balance: string;
  periodLength: string;
  lastClaim: string;
  distributed: string;
}

export default getReservesDistributorData;
