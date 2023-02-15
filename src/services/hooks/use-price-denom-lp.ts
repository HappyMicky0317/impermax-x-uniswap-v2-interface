
import { Web3Provider } from '@ethersproject/providers';
import { useQuery } from 'react-query';

import { ROUTER_ADDRESSES } from 'config/web3/contracts/routers';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import Router01JSON from 'abis/contracts/IRouter01.json';
import CollateralSON from 'abis/contracts/ICollateral.json';

const usePriceDenomLP = (
  uniswapV2PairAddress: string,
  chainID: number,
  library: Web3Provider | undefined
): {
  isLoading: boolean;
  // TODO: should type properly
  data: any | undefined;
  error: Error | null
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

  const collateralAddress = lendingPool?.collateral;
  const {
    isLoading: pricesLoading,
    data: prices,
    error: pricesError
  } = useQuery<any, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      collateralAddress,
      'getPrices'
    ],
    library ?
      // TODO: should type properly
      genericFetcher<any>(
        library,
        CollateralSON.abi,
        true
      ) :
      Promise.resolve,
    {
      enabled: !!library
    }
  );

  return {
    isLoading: (
      lendingPoolLoading ||
      pricesLoading
    ),
    data: prices,
    error: (
      lendingPoolError ??
      pricesError
    )
  };
};

export default usePriceDenomLP;
