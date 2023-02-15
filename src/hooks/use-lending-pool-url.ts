
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import usePairAddress from 'hooks/usePairAddress';
import {
  PAGES,
  PARAMETERS
} from 'utils/constants/links';

const useLendingPoolURL = () : string => {
  const uniswapV2PairAddress = usePairAddress();
  const { chainId } = useWeb3React<Web3Provider>();

  if (!chainId) {
    throw new Error('Invalid Chain ID!');
  }

  const lendingPoolURL =
    chainId ?
      PAGES.LENDING_POOL
        .replace(`:${PARAMETERS.CHAIN_ID}`, chainId.toString())
        .replace(`:${PARAMETERS.UNISWAP_V2_PAIR_ADDRESS}`, uniswapV2PairAddress) :
      '';

  return lendingPoolURL;
};

export default useLendingPoolURL;
