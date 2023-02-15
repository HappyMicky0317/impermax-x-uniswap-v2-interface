
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

import ERC20JSON from 'abis/contracts/IERC20.json';

const getERC20Contract = (address: string, library: Web3Provider, account?: string): Contract => {
  return new Contract(address, ERC20JSON.abi, account ? library.getSigner(account) : library);
};

export default getERC20Contract;
