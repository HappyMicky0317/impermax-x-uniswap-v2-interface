// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from 'store/transactions/hooks';
import useImpermaxRouter, { useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { useAvailableClaimable } from './useData';
import { formatAmount } from '../utils/format';
import { DistributorDetails } from '../utils/constants';

export default function useClaimDistributor(distributor: DistributorDetails): [ButtonState, () => Promise<void>] {
  const availableClaimable = useAvailableClaimable(distributor.claimableAddress);
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);

  const summary = `Claim ${ formatAmount(availableClaimable) } IMX from ${distributor.name}`;

  const claimDistributorState: ButtonState = useMemo(() => {
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [pending]);

  const claimDistributor = useCallback(async (): Promise<void> => {
    if (claimDistributorState !== ButtonState.Ready) return;
    setPending(true);
    try {
      await impermaxRouter.claimDistributor(distributor, (hash: string) => {
        addTransaction({ hash }, { summary });
      });
      doUpdate();
    } finally {
      setPending(false);
    }
  }, [distributor, summary, addTransaction]);

  return [claimDistributorState, claimDistributor];
}
