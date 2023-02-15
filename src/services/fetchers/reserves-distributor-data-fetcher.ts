
import getReservesDistributorData, { ReservesDistributorData } from 'services/get-reserves-distributor-data';

const RESERVES_DISTRIBUTOR_DATA_FETCHER = 'reserves-distributor-data-fetcher';

// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const reservesDistributorDataFetcher = async ({ queryKey }: any): Promise<ReservesDistributorData> => {
  const [
    _key,
    chainID
  ] = queryKey;

  if (_key !== RESERVES_DISTRIBUTOR_DATA_FETCHER) {
    throw new Error('Invalid key!');
  }

  return await getReservesDistributorData(chainID);
};

export {
  RESERVES_DISTRIBUTOR_DATA_FETCHER
};

export type {
  ReservesDistributorData
};

export default reservesDistributorDataFetcher;
