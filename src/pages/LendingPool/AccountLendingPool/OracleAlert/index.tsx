
import clsx from 'clsx';
import { InformationCircleIcon } from '@heroicons/react/solid';

const OracleAlert = (): JSX.Element => (
  <div
    className={clsx(
      'p-4',
      'rounded-md',
      'bg-impermaxCornflower-200',
      'border',
      'border-impermaxCornflower'
    )}>
    <div className='flex'>
      <div className='flex-shrink-0'>
        <InformationCircleIcon
          className={clsx(
            'h-5',
            'w-5',
            'text-impermaxAstral-400'
          )}
          aria-hidden='true' />
      </div>
      <div
        className={clsx(
          'ml-3',
          'flex-1',
          'md:flex',
          'md:justify-between'
        )}>
        <p
          className={clsx(
            'text-sm',
            'text-impermaxAstral'
          )}>
          This lending pool has just been created and the TWAP price oracle is not ready yet.
            Every time a new pair is created on Impermax,
            it cannot be used for 30 minutes in order to gather enough price history.
        </p>
      </div>
    </div>
  </div>
);

export default OracleAlert;
