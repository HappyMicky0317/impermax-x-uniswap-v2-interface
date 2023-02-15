
import {
  useQuery,
  UseQueryResult
} from 'react-query';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';

import ERC20JSON from 'abis/contracts/IERC20.json';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';

const useTokenBalance = (
  chainID: number | undefined,
  library: Web3Provider | undefined,
  address: string | undefined,
  account: string | null | undefined
): UseQueryResult<BigNumber, Error> => {
  return useQuery<BigNumber, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      address,
      'balanceOf',
      account
    ],
    (chainID && library && address && account) ?
      genericFetcher<BigNumber>(library, ERC20JSON.abi) :
      Promise.resolve,
    {
      enabled: !!(chainID && library && address && account)
    }
  );
};

export default useTokenBalance;
