
import getTVLData, { TvlData } from 'services/get-tvl-data';

const TVL_DATA_FETCHER = 'tvl-data-fetcher';

// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const tvlDataFetcher = async ({ queryKey }: any): Promise<TvlData> => {
  const [
    _key,
    chainID
  ] = queryKey;

  if (_key !== TVL_DATA_FETCHER) {
    throw new Error('Invalid key!');
  }

  return await getTVLData(chainID);
};

export {
  TVL_DATA_FETCHER
};

export type {
  TvlData
};

export default tvlDataFetcher;
