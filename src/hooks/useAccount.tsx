import { useContext } from 'react';
import { AccountContext } from 'contexts/AccountProvider';

export default function useAccount() {
  const account = useContext(AccountContext);
  return account;
}
