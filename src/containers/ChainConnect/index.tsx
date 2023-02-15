
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import ChainConnectModal from './ChainConnectModal';
import ImpermaxDefaultOutlinedButton from 'components/buttons/ImpermaxDefaultOutlinedButton';
import ImpermaxImage from 'components/UI/ImpermaxImage';
import {
  CHAIN_ICON_PATHS,
  CHAIN_LABELS
} from 'config/web3/chains';

const ChainConnect = (): JSX.Element | null => {
  const [chainModalOpen, setChainModalOpen] = React.useState(false);

  const {
    active,
    chainId
  } = useWeb3React<Web3Provider>();
  if (!active) return null;

  if (!chainId) {
    throw new Error('Invalid chain ID!');
  }

  const handleChainModalOpen = () => {
    setChainModalOpen(true);
  };

  const handleChainModalClose = () => {
    setChainModalOpen(false);
  };

  return (
    <>
      <ImpermaxDefaultOutlinedButton
        style={{
          height: 36
        }}
        onClick={handleChainModalOpen}
        startIcon={
          // TODO: should use `ImpermaxPicture`
          <ImpermaxImage
            className='rounded'
            width={20}
            height={20}
            src={CHAIN_ICON_PATHS[chainId]}
            alt='Switch Chain' />
        }>
        {CHAIN_LABELS[chainId]}
      </ImpermaxDefaultOutlinedButton>
      <ChainConnectModal
        open={chainModalOpen}
        onClose={handleChainModalClose} />
    </>
  );
};

export default ChainConnect;
