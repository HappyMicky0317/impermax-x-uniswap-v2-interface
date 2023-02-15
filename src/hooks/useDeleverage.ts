// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from 'store/transactions/hooks';
import usePairAddress from './usePairAddress';
import useImpermaxRouter, { useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { PermitData } from './useApprove';
import { useToNumber, useSymbol } from './useData';
import { formatFloat } from '../utils/format';

export default function useDeleverage(
  approvalState: ButtonState,
  invalidInput: boolean,
  tokens: BigNumber,
  amountAMin: BigNumber,
  amountBMin: BigNumber,
  permitData: PermitData
): [ButtonState, () => Promise<void>] {
  const uniswapV2PairAddress = usePairAddress();
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);

  const val = useToNumber(tokens);
  const symbol = useSymbol();
  const summary = `Deleverage ${symbol}: withdraw ${formatFloat(val)} ${symbol}`;

  const deleverageState: ButtonState = useMemo(() => {
    if (invalidInput) return ButtonState.Disabled;
    if (approvalState !== ButtonState.Done) return ButtonState.Disabled;
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [approvalState, pending]);

  const deleverage = useCallback(async (): Promise<void> => {
    if (deleverageState !== ButtonState.Ready) return;
    setPending(true);
    try {
      await impermaxRouter.deleverage(uniswapV2PairAddress, tokens, amountAMin, amountBMin, permitData, (hash: string) => {
        addTransaction({ hash }, { summary });
      });
      doUpdate();
    } finally {
      setPending(false);
    }
  }, [uniswapV2PairAddress, addTransaction, tokens, amountAMin, amountBMin, permitData]);

  return [deleverageState, deleverage];
}
