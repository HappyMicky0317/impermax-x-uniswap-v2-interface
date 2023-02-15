
import clsx from 'clsx';

import ImpermaxLink from 'components/UI/ImpermaxLink';

const Information = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'space-y-3',
      className
    )}
    {...rest}>
    <h2
      className={clsx(
        'text-textPrimary',
        'font-medium',
        'text-lg'
      )}>
      How does IMX staking work?
    </h2>
    <p
      className={clsx(
        'text-textSecondary',
        'text-base',
        'text-justify'
      )}>
      {`
        Up to 20% of all the interests paid on Impermax are kept by the protocol as profit
         and used to buy back IMX from the market.
         These tokens are then distributed among IMX stakers
         proportionally to their share of the pool.
         By staking IMX you receive an xIMX token that will continuously compound staking profits.
         You can unstake at any moment
         in order to receive all the originally deposited IMX and any additional staking profit.
      `}
      <ImpermaxLink
        href='https://impermax.medium.com/introducing-imx-staking-281e7b7b54c'
        className={clsx(
          'underline',
          'cursor-pointer',
          'text-impermaxJade'
        )}
        target='_blank'
        rel='noopener noreferrer'>
        Learn more
      </ImpermaxLink>
    </p>
  </div>
);

export default Information;
