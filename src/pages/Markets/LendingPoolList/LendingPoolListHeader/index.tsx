
import * as React from 'react';
import clsx from 'clsx';

import
LendingPoolListItemDesktopGridWrapper
  from 'pages/Markets/LendingPoolList/LendingPoolListItem/LendingPoolListItemDesktopGridWrapper';
import ImpermaxTooltip from 'components/UI/ImpermaxTooltip';
import { ReactComponent as OutlineQuestionMarkCircleIcon } from 'assets/images/icons/outline-question-mark-circle.svg';

const Heading = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <h6
    className={clsx(
      'truncate',
      className
    )}
    {...rest}>
    {children}
  </h6>
);

const LendingPoolListHeader = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  return (
    <LendingPoolListItemDesktopGridWrapper
      className={clsx(
        'text-textSecondary',
        'text-sm',
        className
      )}
      {...rest}>
      <Heading className='col-span-3'>
        Market
      </Heading>
      <Heading>Total Supply</Heading>
      <Heading>Total Borrowed</Heading>
      <Heading>Supply APY</Heading>
      <Heading>Borrow APY</Heading>
      <Heading
        className={clsx(
          'flex',
          'items-center',
          'space-x-1'
        )}>
        <span>Leveraged LP APY</span>
        <ImpermaxTooltip label='Based on last 7 days trading fees assuming a 5x leverage'>
          <OutlineQuestionMarkCircleIcon
            width={18}
            height={18} />
        </ImpermaxTooltip>
      </Heading>
    </LendingPoolListItemDesktopGridWrapper>
  );
};

export default LendingPoolListHeader;
