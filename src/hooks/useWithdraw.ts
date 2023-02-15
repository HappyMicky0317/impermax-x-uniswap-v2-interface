// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from 'store/transactions/hooks';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import useImpermaxRouter, { useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { PermitData } from './useApprove';
import { useSymbol, usefromTokens } from './useData';
import { formatFloat } from '../utils/format';

export default function useWithdraw(approvalState: ButtonState, tokens: BigNumber, invalidInput: boolean, permitData: PermitData): [ButtonState, () => Promise<void>] {
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);

  const val = usefromTokens(tokens);
  const symbol = useSymbol();
  const summary = `Withdraw ${formatFloat(val)} ${symbol}`;

  const withdrawState: ButtonState = useMemo(() => {
    if (invalidInput) return ButtonState.Disabled;
    if (approvalState !== ButtonState.Done) return ButtonState.Disabled;
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [approvalState, pending]);

  const withdraw = useCallback(async (): Promise<void> => {
    if (withdrawState !== ButtonState.Ready) return;
    setPending(true);
    try {
      await impermaxRouter.withdraw(uniswapV2PairAddress, poolTokenType, tokens, permitData, (hash: string) => {
        addTransaction({ hash }, { summary });
      });
      doUpdate();
    } finally {
      setPending(false);
    }
  }, [approvalState, uniswapV2PairAddress, poolTokenType, addTransaction, tokens, permitData]);

  return [withdrawState, withdraw];
}
