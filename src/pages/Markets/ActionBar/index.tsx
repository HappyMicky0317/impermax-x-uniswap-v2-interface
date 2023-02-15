
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { LinkIcon } from '@heroicons/react/outline';
import clsx from 'clsx';

import ChainSelect from './ChainSelect';
import ImpermaxJadeContainedButton from 'components/buttons/ImpermaxJadeContainedButton';
import { PAGES } from 'utils/constants/links';

const ActionBar = (): JSX.Element => {
  const { active } = useWeb3React<Web3Provider>();

  return (
    <div
      className={clsx(
        'flex',
        'justify-between',
        'items-center'
      )}>
      <ChainSelect routeLink={PAGES.MARKETS} />
      <Link
        className={clsx(
          { 'pointer-events-none': !active }
        )}
        to={PAGES.CREATE_NEW_PAIR}>
        <ImpermaxJadeContainedButton
          disabled={!active}
          style={{ height: 36 }}
          endIcon={
            <LinkIcon
              className={clsx(
                'w-4',
                'h-4'
              )} />
          }>
          New Market
        </ImpermaxJadeContainedButton>
      </Link>
    </div>
  );
};

export default ActionBar;
