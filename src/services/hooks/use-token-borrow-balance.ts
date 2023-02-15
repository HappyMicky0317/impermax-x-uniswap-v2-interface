
import { useQuery } from 'react-query';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';

import { ROUTER_ADDRESSES } from 'config/web3/contracts/routers';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import Router01JSON from 'abis/contracts/IRouter01.json';
import BorrowableJSON from 'abis/contracts/IBorrowable.json';
import UniswapV2PairJSON from 'abis/contracts/IUniswapV2Pair.json';
import ERC20JSON from 'abis/contracts/IERC20.json';
import { PoolTokenType } from 'types/interfaces';

const useTokenBorrowBalance = (
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

  let borrowableAddress;
  switch (poolToken) {
  case PoolTokenType.BorrowableA:
    borrowableAddress = lendingPool?.borrowableA;
    break;
  case PoolTokenType.BorrowableB:
    borrowableAddress = lendingPool?.borrowableB;
    break;
  default:
    throw new Error('Invalid poolTokenType!');
  }
  const {
    isLoading: bigBorrowBalanceLoading,
    data: bigBorrowBalance,
    error: bigBorrowBalanceError
  } = useQuery<BigNumber, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      borrowableAddress,
      'borrowBalance',
      account
    ],
    (library && account) ?
      genericFetcher<BigNumber>(
        library,
        BorrowableJSON.abi
      ) :
      Promise.resolve,
    {
      enabled: !!(library && account)
    }
  );

  let tokenAddressMethodName: string | undefined;
  switch (poolToken) {
  case PoolTokenType.BorrowableA:
    tokenAddressMethodName = 'token0';
    break;
  case PoolTokenType.BorrowableB:
    tokenAddressMethodName = 'token1';
    break;
  default:
    throw new Error('Invalid poolTokenType!');
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

  let borrowBalance: number | undefined;
  if (bigBorrowBalance && tokenDecimals) {
    borrowBalance = parseFloat(formatUnits(bigBorrowBalance, tokenDecimals));
  } else {
    borrowBalance = undefined;
  }

  return {
    isLoading: (
      lendingPoolLoading ||
      bigBorrowBalanceLoading ||
      tokenAddressLoading ||
      tokenDecimalsLoading
    ),
    data: borrowBalance,
    error: (
      lendingPoolError ||
      bigBorrowBalanceError ||
      tokenAddressError ||
      tokenDecimalsError
    )
  };
};

export default useTokenBorrowBalance;
