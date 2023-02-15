
import clsx from 'clsx';

import ImpermaxJadeContainedButton from 'components/buttons/ImpermaxJadeContainedButton';
import ImpermaxInput from 'components/UI/ImpermaxInput';

const NAVIGATION = {
  COIN_OFFERINGS: [
    { name: 'Hot tokens', href: '#' },
    { name: 'New listings', href: '#' },
    { name: 'Upcoming listings', href: '#' }
  ],
  IMPERMAX: [
    { name: 'How to buy', href: '#' },
    { name: 'Homepage', href: '#' },
    { name: 'Buy now', href: '#' },
    { name: 'Our team', href: '#' }
  ],
  APPLY: [
    { name: 'Apply now', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Why us', href: '#' },
    { name: 'Requirements', href: '#' }
  ],
  STAKING: [
    { name: 'How it works', href: '#' },
    { name: 'Connect wallet', href: '#' }
  ]
};

const UpperPart = (): JSX.Element => (
  <div
    className={clsx(
      'xl:grid',
      'xl:grid-cols-3',
      'xl:gap-8'
    )}>
    <div
      className={clsx(
        'grid',
        'grid-cols-2',
        'gap-8',
        'xl:col-span-2'
      )}>
      <div
        className={clsx(
          'md:grid',
          'md:grid-cols-2',
          'md:gap-8'
        )}>
        <div>
          <h3
            className={clsx(
              'text-sm',
              'font-semibold',
              'text-gray-400',
              'tracking-wider',
              'uppercase'
            )}>
            Coin offerings
          </h3>
          <ul
            className={clsx(
              'mt-4',
              'space-y-4'
            )}>
            {NAVIGATION.COIN_OFFERINGS.map(item => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={clsx(
                    'text-base',
                    'text-textSecondary',
                    'hover:text-textPrimary'
                  )}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={clsx(
            'mt-12',
            'md:mt-0'
          )}>
          <h3
            className={clsx(
              'text-sm',
              'font-semibold',
              'text-gray-400',
              'tracking-wider',
              'uppercase'
            )}>
            IMPERMAX
          </h3>
          <ul
            className={clsx(
              'mt-4',
              'space-y-4'
            )}>
            {NAVIGATION.IMPERMAX.map(item => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={clsx(
                    'text-base',
                    'text-textSecondary',
                    'hover:text-textPrimary'
                  )}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={clsx(
          'md:grid',
          'md:grid-cols-2',
          'md:gap-8'
        )}>
        <div>
          <h3
            className={clsx(
              'text-sm',
              'font-semibold',
              'text-gray-400',
              'tracking-wider',
              'uppercase'
            )}>
            Apply
          </h3>
          <ul
            className={clsx(
              'mt-4',
              'space-y-4'
            )}>
            {NAVIGATION.APPLY.map(item => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={clsx(
                    'text-base',
                    'text-textSecondary',
                    'hover:text-textPrimary'
                  )}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={clsx(
            'mt-12',
            'md:mt-0'
          )}>
          <h3
            className={clsx(
              'text-sm',
              'font-semibold',
              'text-gray-400',
              'tracking-wider',
              'uppercase'
            )}>
            Staking
          </h3>
          <ul
            className={clsx(
              'mt-4',
              'space-y-4'
            )}>
            {NAVIGATION.STAKING.map(item => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={clsx(
                    'text-base',
                    'text-textSecondary',
                    'hover:text-textPrimary'
                  )}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    <div
      className={clsx(
        'mt-8',
        'xl:mt-0'
      )}>
      <h3
        className={clsx(
          'text-sm',
          'font-semibold',
          'text-gray-400',
          'tracking-wider',
          'uppercase'
        )}>
        Subscribe to our newsletter
      </h3>
      <p
        className={clsx(
          'mt-4',
          'text-base',
          'text-textSecondary'
        )}>
        The latest news, articles, and resources, sent to your inbox weekly.
      </p>
      <form
        className={clsx(
          'mt-4',
          'sm:flex',
          'sm:max-w-md'
        )}>
        {/* TODO: should componentize */}
        <label
          htmlFor='emailAddress'
          className='sr-only'>
          Email address
        </label>
        <ImpermaxInput
          type='email'
          name='emailAddress'
          id='emailAddress'
          autoComplete='email'
          required
          placeholder='Enter your email' />
        <div
          className={clsx(
            'mt-3',
            'rounded-md',
            'sm:mt-0',
            'sm:ml-3',
            'sm:flex-shrink-0'
          )}>
          <ImpermaxJadeContainedButton
            style={{
              height: '100%'
            }}
            type='submit'>
            Subscribe
          </ImpermaxJadeContainedButton>
        </div>
      </form>
    </div>
  </div>
);

export default UpperPart;
