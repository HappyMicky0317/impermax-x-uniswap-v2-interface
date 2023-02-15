// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getAddress } from '@ethersproject/address';

import { W_ETH_ADDRESSES } from 'config/web3/contracts/w-eths';
import { PoolTokenType } from '../types/interfaces';
import { useUnderlyingAddress } from './useData';

export function useTokenIcon(poolTokenTypeArg?: PoolTokenType) : string {
  const tokenAddress = useUnderlyingAddress(poolTokenTypeArg);
  if (!tokenAddress) return '';
  const convertedAddress = getAddress(tokenAddress);
  try {
    return `/assets/images/token-logos/${convertedAddress}.png`;
  } catch {
    // TODO: <
    // TODO: not working
    return '/assets/images/default.png';
    // TODO: >
  }
}

export function useAddLiquidityUrl() : string {
  const { chainId } = useWeb3React<Web3Provider>();
  const wETHAddress = W_ETH_ADDRESSES[chainId];
  const tokenAAddress = useUnderlyingAddress(PoolTokenType.BorrowableA);
  const tokenBAddress = useUnderlyingAddress(PoolTokenType.BorrowableB);
  const addressA = tokenAAddress === wETHAddress ? 'ETH' : tokenAAddress;
  const addressB = tokenBAddress === wETHAddress ? 'ETH' : tokenBAddress;
  return 'https://app.uniswap.org/#/add/' + addressA + '/' + addressB;
}

export function useTransactionUrlGenerator() : (hash: string) => string {
  const { chainId } = useWeb3React<Web3Provider>();
  const subdomain = chainId === 3 ? 'ropsten.' : '';
  return (hash: string) => 'https://' + subdomain + 'etherscan.io/tx/' + hash;
}

export function useTransactionUrl(hash: string) : string {
  const generator = useTransactionUrlGenerator();
  return generator(hash);
}
