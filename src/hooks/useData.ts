// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { PoolTokenType, Address } from '../types/interfaces';
import usePoolToken from './usePoolToken';
import usePairAddress from './usePairAddress';
import { useState, useEffect } from 'react';
import { useRouterCallback } from './useImpermaxRouter';
import { BigNumber } from '@ethersproject/bignumber';
import { decimalToBalance } from '../utils/ether-utils';
import { useSubgraphCallback } from './useSubgraph';
import { InputAddressState } from 'pages/CreateNewPair';

export function useToken(poolTokenTypeArg?: PoolTokenType) {
  const uniswapV2PairAddress = usePairAddress();
  // TODO: <
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const poolTokenType = poolTokenTypeArg ?? usePoolToken();
  // TODO: >
  return { uniswapV2PairAddress, poolTokenType };
}

export function useDecimals(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [decimals, setDecimals] = useState<number>();
  useSubgraphCallback(async subgraph => setDecimals(await subgraph.getDecimals(uniswapV2PairAddress, poolTokenType)));
  return decimals;
}

export function useSymbol(poolTokenTypeArg?: PoolTokenType) : string {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [symbol, setSymbol] = useState<string>('');
  useSubgraphCallback(async subgraph => setSymbol(await subgraph.getSymbol(uniswapV2PairAddress, poolTokenType)));
  return symbol;
}

export function useExchangeRate(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  useRouterCallback(async router => setExchangeRate(await router.getExchangeRate(uniswapV2PairAddress, poolTokenType)));
  return exchangeRate;
}

export function useStoredExchangeRate(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [storedExchangeRate, setStoredExchangeRate] = useState<number>(1);
  useSubgraphCallback(async subgraph => setStoredExchangeRate(await subgraph.getExchangeRate(uniswapV2PairAddress, poolTokenType)));
  return storedExchangeRate;
}

export function useStoredBorrowIndex(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [storedBorrowIndex, setStoredBorrowIndex] = useState<number>(1);
  useSubgraphCallback(async subgraph => setStoredBorrowIndex(await subgraph.getBorrowIndex(uniswapV2PairAddress, poolTokenType)));
  return storedBorrowIndex;
}

export function useTokenPrice(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [tokenPrice, setTokenPrice] = useState<number>(null);
  useSubgraphCallback(async subgraph => setTokenPrice(await subgraph.getTokenPrice(uniswapV2PairAddress, poolTokenType)));
  return tokenPrice;
}

export function useUnderlyingAddress(poolTokenTypeArg?: PoolTokenType) : string {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [tokenAddress, setTokenAddress] = useState<string>('');
  useSubgraphCallback(async subgraph => setTokenAddress(await subgraph.getUnderlyingAddress(uniswapV2PairAddress, poolTokenType)));
  return tokenAddress;
}

export function useUniswapAPY() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [uniswapAPY, setUniswapAPY] = useState<number>(0);
  useSubgraphCallback(async subgraph => setUniswapAPY(await subgraph.getUniswapAPY(uniswapV2PairAddress)));
  return uniswapAPY;
}

export function useNextSupplyAPY(supplyAmount: number, poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [nextSupplyAPY, setNextSupplyAPY] = useState<number>(0);
  useSubgraphCallback(
    async subgraph => setNextSupplyAPY(await subgraph.getNextSupplyAPY(uniswapV2PairAddress, poolTokenType, supplyAmount)),
    [supplyAmount]
  );
  return nextSupplyAPY;
}

export function useNextBorrowAPY(borrowAmount: number, poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [nextBorrowAPY, setNextBorrowAPY] = useState<number>(0);
  useSubgraphCallback(
    async subgraph => setNextBorrowAPY(await subgraph.getNextBorrowAPY(uniswapV2PairAddress, poolTokenType, borrowAmount)),
    [borrowAmount]
  );
  return nextBorrowAPY;
}

export function useNextFarmingAPY(borrowAmount: number, poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [nextFarmingAPY, setNextFarmingAPY] = useState<number>(0);
  useSubgraphCallback(
    async subgraph => setNextFarmingAPY(await subgraph.getNextFarmingAPY(uniswapV2PairAddress, poolTokenType, borrowAmount)),
    [borrowAmount]
  );
  return nextFarmingAPY;
}

export function useRewardSpeed(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [rewardSpeed, setRewardSpeed] = useState<number>(0);
  useSubgraphCallback(async subgraph => setRewardSpeed(await subgraph.getRewardSpeed(uniswapV2PairAddress, poolTokenType)));
  return rewardSpeed;
}

export function useIsValidPair(uniswapV2PairAddress: Address) : InputAddressState {
  const [inputAddressState, setInputAddressState] = useState<InputAddressState>(InputAddressState.INVALID_ADDRESS);
  const [toCheckUniswapV2PairAddress, setToCheckUniswapV2PairAddress] = useState<string>();
  useEffect(() => {
    // eslint-disable-next-line no-negated-condition
    if (!/^0x[a-fA-F0-9]{40}$/g.test(uniswapV2PairAddress)) {
      setInputAddressState(InputAddressState.INVALID_ADDRESS);
      setToCheckUniswapV2PairAddress('');
    } else {
      setInputAddressState(InputAddressState.LOADING);
      setToCheckUniswapV2PairAddress(uniswapV2PairAddress);
    }
  }, [uniswapV2PairAddress]);
  useRouterCallback(async router => {
    const isValidPair = await router.isValidPair(toCheckUniswapV2PairAddress);
    if (isValidPair) setInputAddressState(InputAddressState.VALID);
    else setInputAddressState(InputAddressState.INVALID_PAIR);
  }, [toCheckUniswapV2PairAddress]);
  return inputAddressState;
}

export function usePairSymbols(uniswapV2PairAddress: Address) : {symbol0: string, symbol1: string} {
  const [pairSymbols, setPairSymbols] = useState<{symbol0: string, symbol1: string}>({ symbol0: '', symbol1: '' });
  useRouterCallback(async router => {
    setPairSymbols(await router.getPairSymbols(uniswapV2PairAddress));
  }, [uniswapV2PairAddress]);
  return pairSymbols;
}

export function useIsPoolTokenCreated(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, updater = 0) : boolean {
  const [isPoolTokenCreated, setIsPoolTokenCreated] = useState<boolean>(false);
  useRouterCallback(async router => {
    setIsPoolTokenCreated(await router.isPoolTokenCreated(uniswapV2PairAddress, poolTokenType));
  }, [uniswapV2PairAddress, updater]);
  return isPoolTokenCreated;
}

export function useIsPairInitialized(uniswapV2PairAddress: Address, updater = 0) : boolean {
  const [isPairInitialized, setIsPairInitialized] = useState<boolean>(false);
  useRouterCallback(async router => {
    setIsPairInitialized(await router.isPairInitialized(uniswapV2PairAddress));
  }, [uniswapV2PairAddress, updater]);
  return isPairInitialized;
}

export function useAvailableBalance(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  useRouterCallback(async router => setAvailableBalance(await router.getAvailableBalance(uniswapV2PairAddress, poolTokenType)));
  return availableBalance;
}

export function useAvailableClaimable(claimableAddress: Address) : number {
  const [availableClaimable, setAvailableClaimable] = useState<number>();
  useRouterCallback(async router => setAvailableClaimable(await router.getAvailableClaimable(claimableAddress)));
  return availableClaimable;
}

export function useDeadline() : BigNumber {
  const [deadline, setDeadline] = useState<BigNumber>();
  useRouterCallback(async router => setDeadline(router.getDeadline()));
  return deadline;
}

export function useToBigNumber(val: number, poolTokenTypeArg?: PoolTokenType, decimalsArg?: number) : BigNumber {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const decimals = decimalsArg ?? useDecimals(poolTokenTypeArg);
  return decimalToBalance(val, decimals);
}

export function useToNumber(amount: BigNumber, poolTokenTypeArg?: PoolTokenType, decimalsArg?: number) : number {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const decimals = decimalsArg ?? useDecimals(poolTokenTypeArg);
  return parseFloat(amount.toString()) / Math.pow(10, decimals);
}

export function useToTokens(val: number, poolTokenTypeArg?: PoolTokenType) : BigNumber {
  const decimals = useDecimals(poolTokenTypeArg);
  const exchangeRate = useExchangeRate(poolTokenTypeArg);
  return decimalToBalance(val / exchangeRate, decimals);
}

export function usefromTokens(amount: BigNumber, poolTokenTypeArg?: PoolTokenType) : number {
  // TODO: <
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const decimals = useDecimals(poolTokenTypeArg);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const exchangeRate = useExchangeRate(poolTokenTypeArg);
  // TODO: >
  return parseFloat(amount.toString()) * exchangeRate / Math.pow(10, decimals);
}
