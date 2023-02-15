import { useContext } from 'react';
import PoolTokenContext from '../contexts/PoolToken';

export default function usePoolToken() {
  const poolTokenType = useContext(PoolTokenContext);
  return poolTokenType;
}
