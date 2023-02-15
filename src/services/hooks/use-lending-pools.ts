
import { useQuery } from 'react-query';

import initialLendingPoolsFetcher, {
  LendingPoolData,
  INITIAL_LENDING_POOLS_FETCHER
} from 'services/fetchers/initial-lending-pools-fetcher';
import uniswapAPYsFetcher, { UNISWAP_APYS_FETCHER } from 'services/fetchers/uniswap-apys-fetcher';

const useLendingPools = (
  chainID: number
): {
  isLoading: boolean;
  data: Array<LendingPoolData> | undefined;
  error: Error | null;
} => {
  const {
    isLoading: initialLendingPoolsLoading,
    data: initialLendingPools,
    error: initialLendingPoolsError
  } = useQuery<Array<LendingPoolData>, Error>(
    [
      INITIAL_LENDING_POOLS_FETCHER,
      chainID
    ],
    initialLendingPoolsFetcher,
    {
      enabled: !!chainID
    }
  );

  const uniswapV2PairAddresses = initialLendingPools?.map(
    (initialLendingPool: { id: string; }) => initialLendingPool.id
  );

  const {
    isLoading: uniswapAPYsLoading,
    data: uniswapAPYs,
    error: uniswapAPYsError
  } = useQuery<{
    [key in string]: number;
  }, Error>(
    [
      UNISWAP_APYS_FETCHER,
      uniswapV2PairAddresses
    ],
    uniswapAPYsFetcher,
    {
      enabled: uniswapV2PairAddresses !== undefined
    }
  );

  let lendingPools: Array<LendingPoolData> | undefined;
  if (initialLendingPools && uniswapAPYs) {
    lendingPools = initialLendingPools.map(initialLendingPool => ({
      ...initialLendingPool,
      pair: {
        ...initialLendingPool.pair,
        uniswapAPY: uniswapAPYs[initialLendingPool.id]
      }
    }));
  } else {
    lendingPools = undefined;
  }

  return {
    isLoading: initialLendingPoolsLoading || uniswapAPYsLoading,
    data: lendingPools,
    error: initialLendingPoolsError ?? uniswapAPYsError
  };
};

export type {
  LendingPoolData
};

export default useLendingPools;
