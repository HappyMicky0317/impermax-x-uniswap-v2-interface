
import getStakingUserData, { StakingUserData } from 'services/get-staking-user-data';

const STAKING_USER_DATA_FETCHER = 'staking-user-data-fetcher';

// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const stakingUserDataFetcher = async ({ queryKey }: any): Promise<StakingUserData> => {
  const [
    _key,
    chainID,
    account
  ] = queryKey;

  if (_key !== STAKING_USER_DATA_FETCHER) {
    throw new Error('Invalid key!');
  }

  return await getStakingUserData(chainID, account);
};

export {
  STAKING_USER_DATA_FETCHER
};

export type {
  StakingUserData
};

export default stakingUserDataFetcher;
