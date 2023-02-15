
// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Web3Provider } from '@ethersproject/providers';
import { isAddress } from '@ethersproject/address';
import { Contract } from '@ethersproject/contracts';

const GENERIC_FETCHER = 'generic-fetcher';

const genericFetcher = <T>(
  library: Web3Provider,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  abi?: any,
  callStatic = false
) =>
    // TODO: should type properly
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async ({ queryKey }: any): Promise<T> => {
      const [
        _key,
        chainId,
        arg1,
        arg2,
        ...rest
      ] = queryKey;

      if (_key !== GENERIC_FETCHER) {
        throw new Error('Invalid key!');
      }
      if (!chainId) {
        throw new Error('Invalid chain ID!');
      }
      if (!arg1) {
        throw new Error('Something went wrong!');
      }

      // TODO: should consider TypeChain case as well as the current ABI case
      // It's a contract
      if (isAddress(arg1)) {
        const address = arg1;
        const method = arg2;
        const contract = new Contract(address, abi, library.getSigner());
        if (callStatic) {
          return await contract.callStatic[method](...rest);
        } else {
          return await contract[method](...rest);
        }
      }

      // It's a ETH call
      const method = arg1;
      return await library[method](arg2, ...rest);
    };

export {
  GENERIC_FETCHER
};

export default genericFetcher;
