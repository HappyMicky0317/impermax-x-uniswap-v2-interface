
import getXIMXData, { XIMXData } from 'services/get-x-imx-data';

const X_IMX_DATA_FETCHER = 'x-imx-data-fetcher';

// TODO: should type properly
// interface Arguments {
//   queryKey: [
//     string,
//     number
//   ]
// }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const xIMXDataFetcher = async ({ queryKey }: any): Promise<XIMXData> => {
  const [
    _key,
    chainID
  ] = queryKey;

  if (_key !== X_IMX_DATA_FETCHER) {
    throw new Error('Invalid key!');
  }

  return await getXIMXData(chainID);
};

export {
  X_IMX_DATA_FETCHER
};

export type {
  XIMXData
};

export default xIMXDataFetcher;
