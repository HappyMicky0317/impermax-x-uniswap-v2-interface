
import * as React from 'react';

import { SubgraphContext } from 'contexts/SubgraphProvider';
import Subgraph from 'subgraph';
import { useRouterUpdate } from './useImpermaxRouter';

export default function useSubgraph(): Subgraph {
  const context = React.useContext(SubgraphContext);
  if (context === undefined) {
    throw new Error('useSubgraph must be used within a SubgraphProvider!');
  }

  return context.subgraph;
}

export function useSubgraphCallback(f: (subgraph: Subgraph) => void, additionalDeps: Array<any> = []): void {
  const context = React.useContext(SubgraphContext);
  if (context === undefined) {
    throw new Error('useSubgraphCallback must be used within a SubgraphProvider!');
  }

  const routerUpdate = useRouterUpdate();

  // TODO: error-prone
  React.useEffect(() => {
    if (!context.subgraph) return;
    // if (!f) return;

    f(context.subgraph);
  }, [
    context.subgraph,
    routerUpdate,
    // f,
    ...additionalDeps
  ]);
}
