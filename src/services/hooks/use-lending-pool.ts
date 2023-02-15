
import { useQuery } from 'react-query';

import initialLendingPoolFetcher, {
  LendingPoolData,
  INITIAL_LENDING_POOL_FETCHER
} from 'services/fetchers/initial-lending-pool-fetcher';
import uniswapAPYsFetcher, { UNISWAP_APYS_FETCHER } from 'services/fetchers/uniswap-apys-fetcher';

const useLendingPool = (
  uniswapV2PairAddress: string,
  chainID: number
): {
  isLoading: boolean;
  data: LendingPoolData | undefined;
  error: Error | null;
} => {
  const lowerCasedUniswapV2PairAddress = uniswapV2PairAddress.toLowerCase();
  const {
    isLoading: initialLendingPoolLoading,
    data: initialLendingPool,
    error: initialLendingPoolError
  } = useQuery<LendingPoolData, Error>(
    [
      INITIAL_LENDING_POOL_FETCHER,
      chainID,
      lowerCasedUniswapV2PairAddress
    ],
    initialLendingPoolFetcher,
    {
      enabled: !!chainID && !!lowerCasedUniswapV2PairAddress
    }
  );

  const uniswapV2PairAddresses = initialLendingPool ? [initialLendingPool.id] : undefined;
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

  let lendingPool: LendingPoolData | undefined;
  if (initialLendingPool && uniswapAPYs) {
    lendingPool = {
      ...initialLendingPool,
      pair: {
        ...initialLendingPool.pair,
        uniswapAPY: uniswapAPYs[initialLendingPool.id]
      }
    };
  } else {
    lendingPool = undefined;
  }

  return {
    isLoading: initialLendingPoolLoading || uniswapAPYsLoading,
    data: lendingPool,
    error: initialLendingPoolError ?? uniswapAPYsError
  };
};

export default useLendingPool;
