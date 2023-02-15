
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import ImpermaxRouter from 'impermax-router';
import useSubgraph from 'hooks/useSubgraph';

const ImpermaxRouterContext = React.createContext<ImpermaxRouterContextInterface | undefined>(undefined);

const ImpermaxRouterProvider: React.FC = ({ children }) => {
  const {
    account,
    chainId,
    library
  } = useWeb3React<Web3Provider>();
  const subgraph = useSubgraph();
  const [routerUpdate, setRouterUpdate] = React.useState<number>(0);
  const [priceInverted, setPriceInverted] = React.useState<boolean>(false);
  const doUpdate = () => {
    if (!impermaxRouter) return;
    impermaxRouter.cleanCache();
    impermaxRouter.subgraph.cleanCache();
    setRouterUpdate(routerUpdate + 1);
  };
  const togglePriceInverted = () => {
    if (!impermaxRouter) return;
    impermaxRouter.setPriceInverted(!priceInverted);
    setPriceInverted(!priceInverted);
  };

  if (!library) {
    throw new Error('Invalid library!');
  }
  if (!chainId) {
    throw new Error('Invalid chain ID!');
  }
  if (!account) {
    throw new Error('Invalid chain ID!');
  }

  const impermaxRouter = new ImpermaxRouter({
    subgraph,
    library,
    chainId,
    priceInverted
  });
  impermaxRouter.unlockWallet(library, account);

  return (
    <ImpermaxRouterContext.Provider
      value={{
        impermaxRouter,
        routerUpdate,
        doUpdate,
        priceInverted,
        togglePriceInverted
      }}>
      {children}
    </ImpermaxRouterContext.Provider>
  );
};

export interface ImpermaxRouterContextInterface {
  impermaxRouter: ImpermaxRouter;
  routerUpdate: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  doUpdate: Function;
  priceInverted: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  togglePriceInverted: Function;
}

export {
  ImpermaxRouterContext
};

export default ImpermaxRouterProvider;
