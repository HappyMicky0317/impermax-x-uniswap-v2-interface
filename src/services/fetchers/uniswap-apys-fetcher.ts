
import getUniswapAPYs from 'services/get-uniswap-apys';

const UNISWAP_APYS_FETCHER = 'uniswap-apys-fetcher';

// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const uniswapAPYsFetcher = async ({ queryKey }: any): Promise<{
  [key in string]: number;
}> => {
  const [
    _key,
    uniswapV2PairAddresses,
    seconds
  ] = queryKey;

  if (_key !== UNISWAP_APYS_FETCHER) {
    throw new Error('Invalid key!');
  }

  return await getUniswapAPYs(uniswapV2PairAddresses, seconds);
};

export {
  UNISWAP_APYS_FETCHER
};

export default uniswapAPYsFetcher;
