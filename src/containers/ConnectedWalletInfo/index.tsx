
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import ImpermaxJadeButtonGroup, { ImpermaxJadeButtonGroupItem } from 'components/button-groups/ImpermaxJadeButtonGroup';
import AccountModal from 'components/InteractionModal/AccountModal';
import shortenAddress from 'utils/helpers/shorten-address';
import {
  useAllTransactions,
  isTransactionRecent
} from 'store/transactions/hooks';
import { TransactionDetails } from 'store/transactions/reducer';
import {
  PAGES,
  PARAMETERS
} from 'utils/constants/links';

const ConnectedWalletInfo = (): JSX.Element | null => {
  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = React.useMemo(() => {
    const transactions = Object.values(allTransactions);

    return transactions.filter(isTransactionRecent).sort(function (a: TransactionDetails, b: TransactionDetails) {
      return b.addedTime - a.addedTime;
    });
  }, [allTransactions]);

  const [accountModalOpen, setAccountModalOpen] = React.useState(false);

  const { account } = useWeb3React<Web3Provider>();
  if (!account) return null;

  const handleAccountModalOpen = () => {
    setAccountModalOpen(true);
  };

  const accountPageURL = PAGES.ACCOUNT.replace(`:${PARAMETERS.ACCOUNT}`, account);

  const pendingTransactions = sortedRecentTransactions.filter(transaction => !transaction.receipt);
  const confirmedTransactions = sortedRecentTransactions.filter(transaction => transaction.receipt);

  return (
    <>
      <ImpermaxJadeButtonGroup>
        <ImpermaxJadeButtonGroupItem
          pending={pendingTransactions.length > 0}
          onClick={handleAccountModalOpen}>
          Transactions
        </ImpermaxJadeButtonGroupItem>
        <ImpermaxJadeButtonGroupItem>
          <Link to={accountPageURL}>
            {shortenAddress(account)}
          </Link>
        </ImpermaxJadeButtonGroupItem>
      </ImpermaxJadeButtonGroup>
      <AccountModal
        show={accountModalOpen}
        toggleShow={setAccountModalOpen}
        pending={pendingTransactions}
        confirmed={confirmedTransactions} />
    </>
  );
};

export default ConnectedWalletInfo;
