
import { UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';

// TODO: focusing on injected for now
function getChainErrorMessage(error: Error): string {
  if (error instanceof NoEthereumProviderError) {
    // eslint-disable-next-line max-len
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  } else if (error instanceof UnsupportedChainIdError) {
    return 'You\'re connected to an unsupported chain. Please connect to the supported chain (Ethereum or Ropsten).';
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize this website to access your Ethereum account.';
  } else {
    console.error('[getChainErrorMessage] error => ', error);
    return 'An unknown error occurred. Check the console for more details.';
  }
}

export default getChainErrorMessage;
