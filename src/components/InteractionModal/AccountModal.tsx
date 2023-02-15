
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useDispatch } from 'react-redux';

import { InteractionModalContainer } from '.';
import { TransactionDetails } from 'store/transactions/reducer';
import { useTransactionUrl } from 'hooks/useUrlGenerator';
import { clearAllTransactions } from 'store/transactions/actions';
import { AppDispatch } from 'store/index';

const MAX_TRANSACTION_HISTORY = 10;

interface TransactionProps {
  tx: TransactionDetails;
  pending?: boolean
}

const Transaction = ({
  tx,
  pending
}: TransactionProps): JSX.Element => {
  const transactionUrl = useTransactionUrl(tx.hash);
  return (
    <div className='transaction-row'>
      <a
        href={transactionUrl}
        target='_blank'
        rel='noopener noreferrer'>
        {tx.summary}
        {pending ? (
          <Spinner
            animation='border'
            size='sm' />
        ) : null}
      </a>
    </div>
  );
};

const AccountModal = ({
  show,
  toggleShow,
  pending,
  confirmed
}: Props): JSX.Element => {
  const { chainId } = useWeb3React<Web3Provider>();

  const dispatch = useDispatch<AppDispatch>();

  const clearAllTransactionsCallback = React.useCallback(() => {
    if (!dispatch) return;
    if (!chainId) return;

    dispatch(clearAllTransactions({ chainId }));
  }, [
    dispatch,
    chainId
  ]);

  return (
    <InteractionModalContainer
      title='Transactions'
      show={show}
      toggleShow={toggleShow}>
      <>
        {pending.length === 0 && confirmed.length === 0 ? (
          <div>You have no recent transaction.</div>
        ) : (
          <>
            <span
              onClick={clearAllTransactionsCallback}
              className='clear-all-transactions'>
              Clear all transactions
            </span>
            {pending.length > 0 && (
              <div>
                {pending.map((tx: TransactionDetails, key: any) => (
                  <Transaction
                    tx={tx}
                    key={key}
                    pending={true} />
                ))}
              </div>
            )}
            {confirmed.length > 0 && (
              <div>
                {confirmed
                  .slice(0, MAX_TRANSACTION_HISTORY)
                  .map((tx: TransactionDetails, index: number) => (
                    <Transaction
                      tx={tx}
                      key={index} />
                  ))}
              </div>
            )}
          </>
        )}
      </>
    </InteractionModalContainer>
  );
};

export interface Props {
  show: boolean;
  toggleShow(s: boolean): void;
  pending: Array<TransactionDetails>;
  confirmed: Array<TransactionDetails>;
}

export default AccountModal;
