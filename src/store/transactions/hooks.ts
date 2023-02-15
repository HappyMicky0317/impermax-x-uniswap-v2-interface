// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import {
  useCallback,
  useMemo
} from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { AppDispatch, AppState } from '../index';
import { addTransaction, clearAllTransactions } from './actions';
import { TransactionDetails } from './reducer';

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: {hash: string},
  customData?: { summary?: string; approval?: { tokenAddress: string; spender: string } },
) => void {
  const {
    chainId,
    account
  } = useWeb3React<Web3Provider>();
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    (
      response: {hash: string},
      {
        summary,
        approval
      }: { summary?: string; approval?: { tokenAddress: string; spender: string } } = {}
    ) => {
      if (!account) return;
      if (!chainId) return;

      const { hash } = response;
      if (!hash) {
        throw Error('No transaction hash found.');
      }
      dispatch(addTransaction({ hash, from: account, chainId, approval, summary }));
    },
    [dispatch, chainId, account]
  );
}

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const { chainId } = useWeb3React<Web3Provider>();
  const state = useSelector<AppState, AppState['transactions']>(state => state.transactions);

  return chainId ? state[chainId] ?? {} : {};
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllTransactions();
  if (!transactionHash || !transactions[transactionHash]) {
    return false;
  }
  return !transactions[transactionHash].receipt;
}

/**
 * Returns whether a transaction happened in the last day
 * @param tx to check for recency
 */

export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000;
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(
  tokenAddress: string,
  spender: string
): boolean {
  if (!tokenAddress || !spender) return false;
  // TODO: <
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const allTransactions = useAllTransactions();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo(
  // TODO: >
    () =>
      typeof tokenAddress === 'string' &&
      typeof spender === 'string' &&
      Object.keys(allTransactions).some(hash => {
        const tx = allTransactions[hash];
        if (!tx) return false;
        if (tx.receipt) {
          return false;
        } else {
          const approval = tx.approval;
          if (!approval) return false;
          return (
            approval.spender === spender &&
            approval.tokenAddress === tokenAddress &&
            isTransactionRecent(tx)
          );
        }
      }),
    [allTransactions, spender, tokenAddress]
  );
}

export function useClearAllTransactions(): { clearAllTransactions: () => void } {
  const { chainId } = useWeb3React<Web3Provider>();

  const dispatch = useDispatch<AppDispatch>();

  return {
    clearAllTransactions: useCallback(() => dispatch(clearAllTransactions({ chainId })), [
      dispatch
    ])
  };
}
