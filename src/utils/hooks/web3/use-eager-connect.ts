
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected } from 'utils/helpers/web3/connectors';

const useEagerConnect = (): boolean => {
  const {
    activate,
    active
  } = useWeb3React();

  const [tried, setTried] = React.useState(false);

  React.useEffect(() => {
    if (!activate) return;

    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, [activate]); // Intentionally only running on mount (make sure it's only mounted once :))

  // If the connection worked, wait until we get confirmation of that to flip the flag
  React.useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [
    tried,
    active
  ]);

  return tried;
};

export default useEagerConnect;
