
import { BigNumber } from '@ethersproject/bignumber';

import { AIRDROP_URLS } from 'config/web3/endpoints/airdrops';
import { AirdropData } from 'types/airdrop';

/**
 * TODO:
 * - could be a hook
 * - could use SWR or react-query
 */

const getAirdropData = async (chainID: number, account: string): Promise<AirdropData> => {
  const airdropURL = AIRDROP_URLS[chainID];
  const response = await fetch(`${airdropURL}/${account}`);
  const airdropData = await response.json();
  const bigAmount = BigNumber.from(airdropData.amount);
  airdropData.amount = bigAmount;

  return airdropData;
};

export default getAirdropData;
