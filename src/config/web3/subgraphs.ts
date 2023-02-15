
import { CHAIN_IDS } from 'config/web3/chains';

const IMPERMAX_SUBGRAPH_URLS: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ROPSTEN]: 'https://api.thegraph.com/subgraphs/name/impermax-finance/impermax-x-uniswap-v2-ropsten',
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: 'https://api.thegraph.com/subgraphs/name/impermax-finance/impermax-x-uniswap-v2'
};

const IMX_STAKING_SUBGRAPH_URLS: {
  [chainId: number]: string;
} = {
  [CHAIN_IDS.ROPSTEN]: 'https://api.thegraph.com/subgraphs/name/impermax-finance/imx-staking-ropsten',
  [CHAIN_IDS.ETHEREUM_MAIN_NET]: 'https://api.thegraph.com/subgraphs/name/impermax-finance/imx-staking',
  [CHAIN_IDS.KOVAN]: 'https://api.thegraph.com/subgraphs/name/impermax-finance/imx-staking-kovan'
};

const UNISWAP_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';

const BLOCKLYTICS_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks';

export {
  IMPERMAX_SUBGRAPH_URLS,
  IMX_STAKING_SUBGRAPH_URLS,
  UNISWAP_SUBGRAPH_URL,
  BLOCKLYTICS_SUBGRAPH_URL
};
