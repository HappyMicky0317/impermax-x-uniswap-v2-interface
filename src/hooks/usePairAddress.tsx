import { useContext } from 'react';
import PairAddressContext from '../contexts/PairAddress';

export default function usePairAddress(): string {
  const uniswapV2PairAddress = useContext(PairAddressContext);
  return uniswapV2PairAddress;
}
