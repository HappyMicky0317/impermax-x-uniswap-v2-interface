
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import clsx from 'clsx';

import IconButton from 'components/IconButton';
import List, { ListItem } from 'components/List';
import ImpermaxModal, {
  Props as ImpermaxModalProps,
  ImpermaxModalInnerWrapper,
  ImpermaxModalTitle
} from 'components/UI/ImpermaxModal';
import ImpermaxImage from 'components/UI/ImpermaxImage'; // TODO: should use next/image component (ideally)
import {
  CHAIN_IDS,
  CHAIN_LABELS,
  CHAIN_ICON_PATHS,
  CHAIN_DETAILS
} from 'config/web3/chains';
import { ReactComponent as CloseIcon } from 'assets/images/icons/close.svg';

const ChainConnectModal = ({
  open,
  onClose
}: Props): JSX.Element => {
  const closeIconRef = React.useRef(null);
  const {
    chainId,
    account,
    library
  } = useWeb3React<Web3Provider>();

  const handleChainConnect = (newChainID: number) => async () => {
    try {
      if (!library) {
        throw new Error('Invalid library!');
      }

      const chainDetail = CHAIN_DETAILS[newChainID];
      await library.send('wallet_addEthereumChain', [chainDetail, account]);

      onClose();
    } catch (error) {
      /**
       * TODO:
       * - https://github.com/MetaMask/metamask-extension/issues/10597
       * - https://ethereum.stackexchange.com/questions/95058/where-can-i-find-a-documentation-of-all-wallet-rpc-calls
       * - https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
       */
      console.log('[handleChainConnect] error.message => ', error.message);
    }
  };

  return (
    <ImpermaxModal
      initialFocus={closeIconRef}
      open={open}
      onClose={onClose}>
      <ImpermaxModalInnerWrapper
        className={clsx(
          'p-6',
          'max-w-lg'
        )}>
        <ImpermaxModalTitle
          as='h3'
          className={clsx(
            'text-lg',
            'font-medium'
          )}>
          Select a Chain
        </ImpermaxModalTitle>
        <IconButton
          className={clsx(
            'w-12',
            'h-12',
            'absolute',
            'top-3',
            'right-3'
          )}
          onClick={onClose}>
          <CloseIcon
            ref={closeIconRef}
            width={18}
            height={18}
            className='text-textSecondary' />
        </IconButton>
        <List className='mt-4'>
          {[
            CHAIN_IDS.ETHEREUM_MAIN_NET,
            CHAIN_IDS.FANTOM,
            CHAIN_IDS.BSC,
            CHAIN_IDS.MATIC,
            CHAIN_IDS.HECO,
            CHAIN_IDS.XDAI,
            CHAIN_IDS.HARMONY,
            CHAIN_IDS.AVALANCHE,
            CHAIN_IDS.OKEX
          ].map(chainID => {
            const selected = chainId === chainID;

            return (
              <ListItem key={chainID}>
                <a
                  href='#impermax' // TODO: should add URL switching
                  className={clsx(
                    selected ? clsx(
                      'text-textPrimary',
                      'bg-gray-100' // TODO: double-check with the design
                    ) : clsx(
                      'text-textSecondary',
                      'hover:text-textPrimary',
                      'hover:bg-gray-50' // TODO: double-check with the design
                    ),
                    'flex',
                    'items-center',
                    'px-3',
                    'py-4',
                    'font-medium',
                    'rounded-md',
                    'space-x-3'
                  )}
                  aria-current={selected ? 'page' : undefined}
                  onClick={handleChainConnect(chainID)}>
                  {/* TODO: should use `ImpermaxPicture` */}
                  <ImpermaxImage
                    width={36}
                    height={36}
                    className='rounded-md'
                    src={CHAIN_ICON_PATHS[chainID]} />
                  <span className='truncate'>
                    {CHAIN_LABELS[chainID]}
                  </span>
                </a>
              </ListItem>
            );
          })}
        </List>
      </ImpermaxModalInnerWrapper>
    </ImpermaxModal>
  );
};

export type Props = Omit<ImpermaxModalProps, 'children'>;

export default ChainConnectModal;
