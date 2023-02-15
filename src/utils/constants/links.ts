
const PARAMETERS = Object.freeze({
  ACCOUNT: 'account',
  UNISWAP_V2_PAIR_ADDRESS: 'uniswapV2PairAddress',
  CHAIN_ID: 'chainId'
});

const PAGES = Object.freeze({
  HOME: '/',
  MARKETS: `/markets/:${PARAMETERS.CHAIN_ID}`,
  LENDING_POOL: `/lending-pool/:${PARAMETERS.CHAIN_ID}/:${PARAMETERS.UNISWAP_V2_PAIR_ADDRESS}`,
  ACCOUNT: `/account/:${PARAMETERS.ACCOUNT}`,
  CREATE_NEW_PAIR: '/create-new-pair',
  RISKS: '/risks',
  CLAIM: '/claim',
  USER_GUIDE: '/user-guide',
  STAKING: '/staking'
});

export {
  PARAMETERS,
  PAGES
};
