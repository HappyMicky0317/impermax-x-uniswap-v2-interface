// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { ApprovalType, PoolTokenType } from '../types/interfaces';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import { useRouterCallback } from './useImpermaxRouter';

export default function useAllowance(approvalType: ApprovalType, pendingApproval?: boolean, poolTokenTypeArg?: PoolTokenType) {
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenTypeContext = usePoolToken();
  const poolTokenType = poolTokenTypeArg ?? poolTokenTypeContext;

  const [allowance, setAllowance] = useState<BigNumber>(null);
  useRouterCallback(async router => {
    router.getAllowance(approvalType, uniswapV2PairAddress, poolTokenType).then(data => setAllowance(data));
  }, [pendingApproval]);

  return allowance;
}
