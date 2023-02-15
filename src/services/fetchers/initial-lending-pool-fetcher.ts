
import getLendingPool, { LendingPoolData } from 'services/get-lending-pool';

const INITIAL_LENDING_POOL_FETCHER = 'initial-lending-pool-fetcher';

// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const initialLendingPoolFetcher = async ({ queryKey }: any): Promise<LendingPoolData> => {
  const [
    _key,
    chainID,
    lowerCasedUniswapV2PairAddress
  ] = queryKey;

  if (_key !== INITIAL_LENDING_POOL_FETCHER) {
    throw new Error('Invalid key!');
  }

  return await getLendingPool(chainID, lowerCasedUniswapV2PairAddress);
};

export {
  INITIAL_LENDING_POOL_FETCHER
};

export type {
  LendingPoolData
};

export default initialLendingPoolFetcher;
