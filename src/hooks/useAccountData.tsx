// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import useAccount from './useAccount';
import { useState } from 'react';
import { useSubgraphCallback } from './useSubgraph';
import { UserData, Address, PoolTokenType } from '../types/interfaces';
import usePairAddress from './usePairAddress';

export function useUserData() : UserData {
  const account = useAccount();
  const [userData, setUserData] = useState<UserData>();
  useSubgraphCallback(
    async subgraph => account && setUserData(await subgraph.getUserData(account)),
    [account]
  );
  return userData;
}

export function useBorrowPositions() : Address[] {
  const account = useAccount();
  const [data, setData] = useState<Address[]>();
  useSubgraphCallback(async subgraph => account && setData(await subgraph.getBorrowPositions(account)));
  return data;
}

export function useSupplyPositions() : Address[] {
  const account = useAccount();
  const [data, setData] = useState<Address[]>();
  useSubgraphCallback(async subgraph => account && setData(await subgraph.getSupplyPositions(account)));
  return data;
}

export function useCollateralAmount() : number {
  const account = useAccount();
  const uniswapV2PairAddress = usePairAddress();
  const [data, setData] = useState<number>();
  useSubgraphCallback(async subgraph => account && setData(await subgraph.getCollateralAmount(account, uniswapV2PairAddress)));
  return data;
}

export function useCollateralValue() : number {
  const account = useAccount();
  const uniswapV2PairAddress = usePairAddress();
  const [data, setData] = useState<number>();
  useSubgraphCallback(async subgraph => account && setData(await subgraph.getCollateralValue(account, uniswapV2PairAddress)));
  return data;
}

export function useBorrowedAmount(poolTokenType: PoolTokenType) : number {
  const account = useAccount();
  const uniswapV2PairAddress = usePairAddress();
  const [data, setData] = useState<number>();
  useSubgraphCallback(async subgraph => account && setData(await subgraph.getBorrowedAmount(account, uniswapV2PairAddress, poolTokenType)));
  return data;
}

export function useBorrowedValue(poolTokenType: PoolTokenType) : number {
  const account = useAccount();
  const uniswapV2PairAddress = usePairAddress();
  const [data, setData] = useState<number>();
  useSubgraphCallback(async subgraph => account && setData(await subgraph.getBorrowedValue(account, uniswapV2PairAddress, poolTokenType)));
  return data;
}

export function useBorrowerEquityValue() : number {
  const account = useAccount();
  const uniswapV2PairAddress = usePairAddress();
  const [data, setData] = useState<number>();
  useSubgraphCallback(async subgraph => account && setData(await subgraph.getBorrowerEquityValue(account, uniswapV2PairAddress)));
  return data;
}

export function useSuppliedAmount(poolTokenType: PoolTokenType) : number {
  const account = useAccount();
  const uniswapV2PairAddress = usePairAddress();
  const [data, setData] = useState<number>();
  useSubgraphCallback(async subgraph => account && setData(await subgraph.getSuppliedAmount(account, uniswapV2PairAddress, poolTokenType)));
  return data;
}

export function useSuppliedValue(poolTokenType: PoolTokenType) : number {
  const account = useAccount();
  const uniswapV2PairAddress = usePairAddress();
  const [data, setData] = useState<number>();
  useSubgraphCallback(async subgraph => account && setData(await subgraph.getSuppliedValue(account, uniswapV2PairAddress, poolTokenType)));
  return data;
}

export function useAccountTotalValueLocked() : number {
  const account = useAccount();
  const [data, setData] = useState<number>();
  useSubgraphCallback(async subgraph => account && setData(await subgraph.getAccountTotalValueLocked(account)));
  return data;
}

export function useAccountTotalValueSupplied() : number {
  const account = useAccount();
  const [data, setData] = useState<number>();
  useSubgraphCallback(async subgraph => account && setData(await subgraph.getAccountTotalValueSupplied(account)));
  return data;
}

export function useAccountTotalValueBorrowed() : number {
  const account = useAccount();
  const [data, setData] = useState<number>();
  useSubgraphCallback(async subgraph => account && setData(await subgraph.getAccountTotalValueBorrowed(account)));
  return data;
}
