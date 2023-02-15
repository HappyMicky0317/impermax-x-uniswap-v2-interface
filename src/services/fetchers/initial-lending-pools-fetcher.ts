
import getLendingPools, { LendingPoolData } from 'services/get-lending-pools';

const INITIAL_LENDING_POOLS_FETCHER = 'initial-lending-pools-fetcher';

// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const initialLendingPoolsFetcher = async ({ queryKey }: any): Promise<Array<LendingPoolData>> => {
  const [
    _key,
    chainID
  ] = queryKey;

  if (_key !== INITIAL_LENDING_POOLS_FETCHER) {
    throw new Error('Invalid key!');
  }

  return await getLendingPools(chainID);
};

export {
  INITIAL_LENDING_POOLS_FETCHER
};

export type {
  LendingPoolData
};

export default initialLendingPoolsFetcher;
