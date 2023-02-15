// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from 'store/transactions/hooks';
import useImpermaxRouter, { useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { usePairSymbols } from './useData';

export enum CreatePairStep {
  BORROWABLE0,
  BORROWABLE1,
  COLLATERAL,
  INITIALIZE
}

export default function useCreateNewPair(uniswapV2PairAddress: string, createPairStep: CreatePairStep): [ButtonState, () => Promise<void>] {
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);

  const { symbol0, symbol1 } = usePairSymbols(uniswapV2PairAddress);
  const summary = createPairStep === CreatePairStep.COLLATERAL ? `Create LP pool for ${symbol0}-${symbol1}` :
    createPairStep === CreatePairStep.BORROWABLE0 ? `Create ${symbol0} pool for ${symbol0}-${symbol1}` :
      createPairStep === CreatePairStep.BORROWABLE1 ? `Create ${symbol1} pool for ${symbol0}-${symbol1}` :
        createPairStep === CreatePairStep.INITIALIZE ? `Initialize ${symbol0}-${symbol1}` : ``;

  const createNewPairState: ButtonState = useMemo(() => {
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [pending]);

  const createNewPair = useCallback(async (): Promise<void> => {
    if (createNewPairState !== ButtonState.Ready) return;
    setPending(true);
    try {
      await impermaxRouter.createNewPair(uniswapV2PairAddress, createPairStep, (hash: string) => {
        addTransaction({ hash }, { summary });
      });
      doUpdate();
    } finally {
      setPending(false);
    }
  }, [uniswapV2PairAddress, addTransaction, createPairStep, summary]);

  return [createNewPairState, createNewPair];
}
