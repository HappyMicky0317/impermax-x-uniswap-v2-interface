
import { Web3Provider } from '@ethersproject/providers';
import { Log } from '@ethersproject/abstract-provider';
import { hexZeroPad } from '@ethersproject/bytes';
import { id } from '@ethersproject/hash';

const CLAIM_LOGS_FETCHER = 'claim-logs-fetcher';

const claimLogsFetcher =
  (library: Web3Provider) =>
    async (farmingPoolAddress: string, account: string): Promise<Array<Log>> => {
      return await library.getLogs({
        fromBlock: 0,
        toBlock: 'latest',
        address: farmingPoolAddress,
        topics: [
          id('Claim(address,uint256)'),
          hexZeroPad(account, 32)
        ]
      });
    };

export {
  CLAIM_LOGS_FETCHER
};

export default claimLogsFetcher;
