
import { Web3Provider } from '@ethersproject/providers';

import { POLLING_INTERVAL } from 'config/web3/chains';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
}

export default getLibrary;
