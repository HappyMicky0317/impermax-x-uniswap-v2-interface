
import { useQuery } from 'react-query';
import { Web3Provider } from '@ethersproject/providers';

import { ROUTER_ADDRESSES } from 'config/web3/contracts/routers';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import Router01JSON from 'abis/contracts/IRouter01.json';
import BorrowableJSON from 'abis/contracts/IBorrowable.json';

const useFarmingPoolAddresses = (
  chainID: number,
  uniswapV2PairAddress: string,
  library: Web3Provider | undefined
): {
  isLoading: boolean;
  data: {
    farmingPoolAAddress: string | undefined;
    farmingPoolBAddress: string | undefined;
  };
  error: Error | null;
} => {
  const routerAddress = ROUTER_ADDRESSES[chainID];
  const {
    isLoading: lendingPoolLoading,
    data: lendingPool,
    error: lendingPoolError
  } = useQuery<any, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      routerAddress,
      'getLendingPool',
      uniswapV2PairAddress
    ],
    library ?
      // TODO: should type properly
      genericFetcher<any>(library, Router01JSON.abi) :
      Promise.resolve,
    {
      enabled: !!library
    }
  );

  const borrowableAAddress = lendingPool?.borrowableA;
  const {
    isLoading: farmingPoolAAddressLoading,
    data: farmingPoolAAddress,
    error: farmingPoolAAddressError
  } = useQuery<string, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      borrowableAAddress,
      'borrowTracker'
    ],
    (borrowableAAddress && library) ?
      genericFetcher<string>(library, BorrowableJSON.abi) :
      Promise.resolve,
    {
      enabled: !!(borrowableAAddress && library)
    }
  );
  const borrowableBAddress = lendingPool?.borrowableB;
  const {
    isLoading: farmingPoolBAddressLoading,
    data: farmingPoolBAddress,
    error: farmingPoolBAddressError
  } = useQuery<string, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      borrowableBAddress,
      'borrowTracker'
    ],
    (borrowableBAddress && library) ?
      genericFetcher<string>(library, BorrowableJSON.abi) :
      Promise.resolve,
    {
      enabled: !!(borrowableBAddress && library)
    }
  );

  return {
    isLoading: lendingPoolLoading || farmingPoolAAddressLoading || farmingPoolBAddressLoading,
    data: {
      farmingPoolAAddress,
      farmingPoolBAddress
    },
    error: lendingPoolError ?? farmingPoolAAddressError ?? farmingPoolBAddressError
  };
};

export default useFarmingPoolAddresses;
