
/* eslint-disable max-len */
import gql from 'graphql-tag';

import apolloFetcher from './apollo-fetcher';
import {
  BLOCKLYTICS_SUBGRAPH_URL,
  UNISWAP_SUBGRAPH_URL
} from 'config/web3/subgraphs';
import { Address } from 'types/interfaces';

const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;
const UNISWAP_FEE = 0.003;

const getBlockByTimestamp = async (timestamp: number) : Promise<number> => {
  const query = gql`{
    blocks (first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }) {
      number
    }
  }`;
  const result = await apolloFetcher(BLOCKLYTICS_SUBGRAPH_URL, query);

  return result.data.blocks[0].number;
};

const getPastVolumes = async (
  uniswapV2PairAddresses: Array<string>,
  seconds: number
): Promise<{
  [key in Address]: number;
}> => {
  const timestamp = Math.floor((new Date()).getTime() / 1000);
  const blockNumber = await getBlockByTimestamp(timestamp - seconds);
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
};

const getCurrentVolumesAndCurrentReserves = async (
  uniswapV2PairAddresses: Array<string>
) : Promise<{
  currentVolumes: {
    [key in Address]: number;
  };
  currentReserves: {
    [key in Address]: number;
  };
}> => {
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
  const currentVolumes: {[key in Address]: number} = {};
  const currentReserves: {[key in Address]: number} = {};
  for (const pair of result.data.pairs) {
    currentVolumes[pair.id] = parseInt(pair.volumeUSD);
    currentReserves[pair.id] = parseInt(pair.reserveUSD);
  }

  return {
    currentReserves,
    currentVolumes
  };
};

const getUniswapAPYs = async (
  uniswapV2PairAddresses: Array<string>,
  seconds: number = 60 * 60 * 24 * 7
): Promise<{
  [key in Address]: number;
}> => {
  const pastVolumes = await getPastVolumes(uniswapV2PairAddresses, seconds);
  const {
    currentVolumes,
    currentReserves
  } = await getCurrentVolumesAndCurrentReserves(uniswapV2PairAddresses);
  const uniswapAPY: {[key in Address]: number} = {};
  for (const uniswapV2PairAddress of uniswapV2PairAddresses) {
    if (!currentReserves[uniswapV2PairAddress]) {
      uniswapAPY[uniswapV2PairAddress] = 0;
      continue;
    }
    const cumVolumePast = pastVolumes[uniswapV2PairAddress] ?? 0;
    const cumVolumeNow = currentVolumes[uniswapV2PairAddress];
    const reserveUSD = currentReserves[uniswapV2PairAddress];
    const volumeUSD = cumVolumeNow - cumVolumePast;
    const yearlyVolume = volumeUSD * SECONDS_IN_YEAR / seconds;
    const yearlyFee = yearlyVolume * UNISWAP_FEE;
    uniswapAPY[uniswapV2PairAddress] = yearlyFee / reserveUSD;
  }

  return uniswapAPY;
};

export default getUniswapAPYs;
