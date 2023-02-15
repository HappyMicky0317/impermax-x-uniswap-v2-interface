
import { InjectedConnector } from '@web3-react/injected-connector';

import { SUPPORTED_CHAIN_IDS } from 'config/web3/chains';

const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS
});

export {
  injected
};
