
import {
  useContext,
  useEffect
} from 'react';
import { ImpermaxRouterContext } from 'contexts/ImpermaxRouterProvider';
import ImpermaxRouter from 'impermax-router';

// TODO: should be one hook
export default function useImpermaxRouter() {
  const context = useContext(ImpermaxRouterContext);

  if (context === undefined) {
    throw new Error('useImpermaxRouter must be used within a ImpermaxRouterProvider');
  }

  return context.impermaxRouter;
}
export function useRouterUpdate() {
  const context = useContext(ImpermaxRouterContext);

  if (context === undefined) {
    throw new Error('useRouterUpdate must be used within a ImpermaxRouterProvider');
  }

  return context.routerUpdate;
}
export function useDoUpdate() {
  const context = useContext(ImpermaxRouterContext);

  if (context === undefined) {
    throw new Error('useDoUpdate must be used within a ImpermaxRouterProvider');
  }

  return context.doUpdate;
}
export function usePriceInverted() {
  const context = useContext(ImpermaxRouterContext);

  if (context === undefined) {
    throw new Error('usePriceInverted must be used within a ImpermaxRouterProvider');
  }

  return context.priceInverted;
}
export function useTogglePriceInverted() {
  const context = useContext(ImpermaxRouterContext);

  if (context === undefined) {
    throw new Error('useTogglePriceInverted must be used within a ImpermaxRouterProvider');
  }

  return context.togglePriceInverted;
}

export function useRouterCallback(f: (impermaxRouter: ImpermaxRouter) => void, additionalDeps: Array<any> = []): void {
  const context = useContext(ImpermaxRouterContext);

  if (context === undefined) {
    throw new Error('useRouterCallback must be used within a ImpermaxRouterProvider');
  }

  const {
    impermaxRouter,
    routerUpdate,
    priceInverted
  } = context;

  return useEffect(() => {
    if (!impermaxRouter) return;
    // if (!f) return;

    f(impermaxRouter);
  }, [
    impermaxRouter,
    routerUpdate,
    priceInverted,
    // f,
    ...additionalDeps
  ]);
}
