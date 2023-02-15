
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { useQuery } from 'react-query';

import { ROUTER_ADDRESSES } from 'config/web3/contracts/routers';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import Router01JSON from 'abis/contracts/IRouter01.json';
import BorrowableJSON from 'abis/contracts/IBorrowable.json';
import UniswapV2PairJSON from 'abis/contracts/IUniswapV2Pair.json';
import ERC20JSON from 'abis/contracts/IERC20.json';
import CollateralSON from 'abis/contracts/ICollateral.json';
import { PoolTokenType } from 'types/interfaces';

const useTokenDeposited = (
  uniswapV2PairAddress: string,
  poolToken: PoolTokenType,
  chainID: number,
  library: Web3Provider | undefined,
  account: string | null | undefined
): {
  isLoading: boolean;
  data: number | undefined;
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

  let borrowableOrCollateralAddress;
  switch (poolToken) {
  case PoolTokenType.BorrowableA:
    borrowableOrCollateralAddress = lendingPool?.borrowableA;
    break;
  case PoolTokenType.BorrowableB:
    borrowableOrCollateralAddress = lendingPool?.borrowableB;
    break;
  case PoolTokenType.Collateral:
    borrowableOrCollateralAddress = lendingPool?.collateral;
    break;
  default:
    throw new Error('Invalid poolTokenType!');
  }
  const {
    isLoading: bigTokenBalanceLoading,
    data: bigTokenBalance,
    error: bigTokenBalanceError
  } = useQuery<BigNumber, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      borrowableOrCollateralAddress,
      'balanceOf',
      account
    ],
    (library && account) ?
      genericFetcher<BigNumber>(
        library,
        poolToken === PoolTokenType.Collateral ?
          CollateralSON.abi :
          BorrowableJSON.abi
      ) :
      Promise.resolve,
    {
      enabled: !!(library && account)
    }
  );

  const {
    isLoading: bigTokenExchangeRateLoading,
    data: bigTokenExchangeRate,
    error: bigTokenExchangeRateError
  } = useQuery<BigNumber, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      borrowableOrCollateralAddress,
      'exchangeRate'
    ],
    library ?
      genericFetcher<BigNumber>(
        library,
        poolToken === PoolTokenType.Collateral ?
          CollateralSON.abi :
          BorrowableJSON.abi,
        true
      ) :
      Promise.resolve,
    {
      enabled: !!library
    }
  );

  let tokenAddressMethodName: string | undefined;
  if (poolToken === PoolTokenType.BorrowableA) {
    tokenAddressMethodName = 'token0';
  }
  if (poolToken === PoolTokenType.BorrowableB) {
    tokenAddressMethodName = 'token1';
  }
  const {
    isLoading: tokenAddressLoading,
    data: tokenAddress,
    error: tokenAddressError
  } = useQuery<string, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      uniswapV2PairAddress,
      tokenAddressMethodName
    ],
    (library && tokenAddressMethodName) ?
      genericFetcher<string>(library, UniswapV2PairJSON.abi) :
      Promise.resolve,
    {
      enabled: !!library && !!tokenAddressMethodName
    }
  );

  const {
    isLoading: tokenDecimalsLoading,
    data: tokenDecimals,
    error: tokenDecimalsError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      tokenAddress,
      'decimals'
    ],
    (tokenAddress && library) ?
      genericFetcher<number>(library, ERC20JSON.abi) :
      Promise.resolve,
    {
      enabled: !!(tokenAddress && library)
    }
  );
  let decimals;
  if (poolToken === PoolTokenType.Collateral) {
    decimals = 18;
  } else {
    decimals = tokenDecimals;
  }

  let tokenDepositedInUSD: number | undefined;
  if (bigTokenExchangeRate && bigTokenBalance && decimals) {
    const tokenExchangeRate = parseFloat(formatUnits(bigTokenExchangeRate));
    const tokenBalance = parseFloat(formatUnits(bigTokenBalance, tokenDecimals));
    tokenDepositedInUSD = tokenBalance * tokenExchangeRate;
  } else {
    tokenDepositedInUSD = undefined;
  }

  return {
    isLoading: (
      lendingPoolLoading ||
      bigTokenExchangeRateLoading ||
      bigTokenBalanceLoading ||
      tokenAddressLoading ||
      tokenDecimalsLoading
    ),
    data: tokenDepositedInUSD,
    error: (
      lendingPoolError ??
      bigTokenBalanceError ??
      bigTokenExchangeRateError ??
      tokenAddressError ??
      tokenDecimalsError
    )
  };
};

export default useTokenDeposited;
