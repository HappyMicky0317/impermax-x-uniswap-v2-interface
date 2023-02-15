
import clsx from 'clsx';

import ImpermaxImage from 'components/UI/ImpermaxImage';

interface CustomProps {
  tokenIconA: string;
  tokenIconB: string;
  symbolA: string;
  symbolB: string;
}

const TokenPairLabel = ({
  tokenIconA,
  tokenIconB,
  symbolA,
  symbolB,
  className
}: CustomProps & React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'flex',
      'flex-shrink-0',
      'items-center',
      '-space-x-1.5',
      className
    )}>
    <ImpermaxImage
      width={32}
      height={32}
      // TODO: could componentize
      className={clsx(
        'inline-block',
        'rounded-full',
        'ring-2',
        'ring-white'
      )}
      src={tokenIconA}
      placeholder='/assets/images/default.png'
      error='/assets/images/default.png'
      alt='Token A' />
    <ImpermaxImage
      width={32}
      height={32}
      className={clsx(
        'inline-block',
        'rounded-full',
        'ring-2',
        'ring-white'
      )}
      src={tokenIconB}
      placeholder='/assets/images/default.png'
      error='/assets/images/default.png'
      alt='Token B' />
    <span
      className={clsx(
        'font-medium',
        'text-textSecondary',
        '!ml-1.5'
      )}>
      {symbolA}/{symbolB}
    </span>
  </div>
);

export default TokenPairLabel;
