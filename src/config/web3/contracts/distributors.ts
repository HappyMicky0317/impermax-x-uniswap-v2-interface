
import { CHAIN_IDS } from 'config/web3/chains';

const DISTRIBUTOR_ADDRESSES = {
  [CHAIN_IDS.ROPSTEN]: [
    {
      claimableAddress: '0x9192b53fe173025733beb33467d730a4e6bb7f36',
      name: 'Private Sale'
    },
    {
      claimableAddress: '0xb9f3413e206f1d658d4dafb233873dde56cf94fc',
      name: 'Advisor Allocation'
    },
    {
      claimableAddress: '0x175608ea84b38d7df7a4358cf679eccb49b8203c',
      name: 'Protocol Growth And Development'
    },
    {
      claimableAddress: '0x8ab3567aba5151a3ab4c1aff2fc9192178ded78d',
      name: 'Core Contributor'
    }
  ],
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: [
    {
      claimableAddress: '0x434547433e383c505e76f22f4174d7ba68b7686c',
      name: 'Private Sale'
    },
    {
      claimableAddress: '0x0f528f19521fde0140668b9eb14025054bfec29e',
      name: 'Advisor Allocation'
    },
    {
      claimableAddress: '0x34c8f7a53e10c17fddf7ee5048c097569d99de59',
      name: 'Protocol Growth And Development'
    },
    {
      claimableAddress: '0x87da8bab9fbd09593f2368dc2f6fac3f80c2a845',
      name: 'Core Contributor'
    }
  ]
};

export {
  DISTRIBUTOR_ADDRESSES
};
