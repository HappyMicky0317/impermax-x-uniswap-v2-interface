
import clsx from 'clsx';
import {
  ArrowSmDownIcon,
  ArrowSmUpIcon
} from '@heroicons/react/solid';

import Panel from 'components/Panel';
import { formatNumberWithUSDCommaDecimals } from 'utils/helpers/format-number';

interface Props {
  totalValueLocked: number;
  totalValueSupplied: number;
  totalValueBorrowed: number;
}

const OverallStatsInternal = ({
  totalValueLocked,
  totalValueSupplied,
  totalValueBorrowed
} : Props): JSX.Element => {
  const stats = [
    {
      name: 'Total Value Locked',
      stat: formatNumberWithUSDCommaDecimals(totalValueLocked),
      previousStat: formatNumberWithUSDCommaDecimals(totalValueLocked),
      change: '0%',
      changeType: 'increase'
    },
    {
      name: 'Total Supplied',
      stat: formatNumberWithUSDCommaDecimals(totalValueSupplied),
      previousStat: formatNumberWithUSDCommaDecimals(totalValueSupplied),
      change: '0%',
      changeType: 'increase'
    },
    {
      name: 'Total Borrowed',
      stat: formatNumberWithUSDCommaDecimals(totalValueBorrowed),
      previousStat: formatNumberWithUSDCommaDecimals(totalValueBorrowed),
      change: '0%',
      changeType: 'decrease'
    }
  ];

  return (
    <>
      <Panel
        className={clsx(
          'bg-white',
          'grid',
          'grid-cols-1',
          'divide-y',
          'divide-gray-200',
          'md:grid-cols-3',
          'md:divide-y-0',
          'md:divide-x'
        )}>
        {stats.map(item => (
          <div
            key={item.name}
            className={clsx(
              'px-4',
              'py-5',
              'sm:p-6'
            )}>
            <dt
              className={clsx(
                'text-base',
                'font-normal',
                'text-textPrimary'
              )}>
              {item.name}
            </dt>
            <dd
              className={clsx(
                'mt-1',
                'flex',
                'justify-between',
                'items-baseline',
                'md:block',
                'lg:flex'
              )}>
              <div
                className={clsx(
                  'flex',
                  'items-baseline',
                  'text-2xl',
                  'font-semibold',
                  'text-impermaxAstral-600'
                )}>
                {item.stat}
                <span
                  className={clsx(
                    'ml-2',
                    'text-sm',
                    'font-medium',
                    'text-textSecondary'
                  )}>
                  from {item.previousStat}
                </span>
              </div>
              <div
                className={clsx(
                  item.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                  clsx(
                    'inline-flex',
                    'items-baseline',
                    'px-2.5',
                    'py-0.5',
                    'rounded-full',
                    'text-sm',
                    'font-medium',
                    'md:mt-2',
                    'lg:mt-0'
                  )
                )}>
                {item.changeType === 'increase' ? (
                  <ArrowSmUpIcon
                    className={clsx(
                      '-ml-1',
                      'mr-0.5',
                      'flex-shrink-0',
                      'self-center',
                      'h-5',
                      'w-5',
                      'text-green-500'
                    )}
                    aria-hidden='true' />
                ) : (
                  <ArrowSmDownIcon
                    className={clsx(
                      '-ml-1',
                      'mr-0.5',
                      'flex-shrink-0',
                      'self-center',
                      'h-5',
                      'w-5',
                      'text-red-500'
                    )}
                    aria-hidden='true' />
                )}
                <span className='sr-only'>
                  {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                </span>
                {item.change}
              </div>
            </dd>
          </div>
        ))}
      </Panel>
    </>
  );
};

export default OverallStatsInternal;
