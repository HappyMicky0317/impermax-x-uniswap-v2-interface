type Address = string;

export type DistributorDetails = {
  claimableAddress: Address;
  name: string;
}

// TODO: should keep as environment variables
// TODO: not used
export const RPC_URLS = {
  1: 'wss://mainnet.infura.io/ws/v3/2644163ee7bc4f2eb8dae1f58642d158',
  3: 'wss://ropsten.infura.io/ws/v3/2644163ee7bc4f2eb8dae1f58642d158'
};

// TODO: not used
// export const ROPSTEN_ETH_IMX: Address = '0x0Efc0766F46E1AD825CE18F54F0793dd6814a947';
// export const ROPSTEN_ETH_DAI: Address = '0x1c5DEe94a34D795f9EEeF830B68B80e44868d316';
// export const ROPSTEN_ETH_UNI: Address = '0x4E99615101cCBB83A462dC4DE2bc1362EF1365e5';
// export const ROPSTEN_ETH_USDC: Address = '0x681A4164703351d6AceBA9D7038b573b444d3353';
// export const MAINNET_ETH_WBTC: Address = '0xBb2b8038a1640196FbE3e38816F3e67Cba72D940';
// export const MAINNET_ETH_USDC: Address = '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc';
// export const MAINNET_USDT_USDC: Address = '0x3041CbD36888bECc7bbCBc0045E3B1f144466f5f';
// export const MAINNET_DUCK_ETH: Address = '0xc5Ed7350E0FB3f780c756bA7d5d8539dc242a414';
