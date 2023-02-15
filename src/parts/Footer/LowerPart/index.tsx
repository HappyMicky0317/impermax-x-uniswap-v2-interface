
import clsx from 'clsx';
import { GlobeAltIcon } from '@heroicons/react/outline';

import {
  IMPERMAX_TELEGRAM_LINK,
  IMPERMAX_TWITTER_LINK,
  IMPERMAX_WEBSITE_LINK,
  IMPERMAX_DISCORD_LINK,
  IMPERMAX_YOU_TUBE_LINK,
  IMPERMAX_MEDIUM_LINK,
  IMPERMAX_GIT_HUB_LINK,
  IMPERMAX_REDDIT_LINK
} from 'config/links';
import { getCurrentYear } from 'utils/helpers/time';
import { ReactComponent as TwitterLogoIcon } from 'assets/images/icons/twitter-logo.svg';
import { ReactComponent as GitHubLogoIcon } from 'assets/images/icons/git-hub-logo.svg';
import { ReactComponent as TelegramLogoIcon } from 'assets/images/icons/telegram-logo.svg';
import { ReactComponent as DiscordLogoIcon } from 'assets/images/icons/discord-logo.svg';
import { ReactComponent as YouTubeLogoIcon } from 'assets/images/icons/you-tube-logo.svg';
import { ReactComponent as MediumLogoIcon } from 'assets/images/icons/medium-logo.svg';
import { ReactComponent as RedditLogoIcon } from 'assets/images/icons/reddit-logo.svg';

const SOCIAL_ITEMS = [
  {
    name: 'Website',
    href: IMPERMAX_WEBSITE_LINK,
    // eslint-disable-next-line react/display-name
    icon: (props: React.ComponentPropsWithRef<'svg'>) => (
      <GlobeAltIcon
        width={24}
        height={24}
        {...props} />
    )
  },
  {
    name: 'Telegram',
    href: IMPERMAX_TELEGRAM_LINK,
    // eslint-disable-next-line react/display-name
    icon: (props: React.ComponentPropsWithRef<'svg'>) => (
      <TelegramLogoIcon
        width={18}
        height={16}
        {...props} />
    )
  },
  {
    name: 'Discord',
    href: IMPERMAX_DISCORD_LINK,
    // eslint-disable-next-line react/display-name
    icon: (props: React.ComponentPropsWithRef<'svg'>) => (
      <DiscordLogoIcon
        width={18}
        height={12}
        {...props} />
    )
  },
  {
    name: 'YouTube',
    href: IMPERMAX_YOU_TUBE_LINK,
    // eslint-disable-next-line react/display-name
    icon: (props: React.ComponentPropsWithRef<'svg'>) => (
      <YouTubeLogoIcon
        width={21}
        height={15}
        {...props} />
    )
  },
  {
    name: 'Medium',
    href: IMPERMAX_MEDIUM_LINK,
    // eslint-disable-next-line react/display-name
    icon: (props: React.ComponentPropsWithRef<'svg'>) => (
      <MediumLogoIcon
        width={16}
        height={14}
        {...props} />
    )
  },
  {
    name: 'Reddit',
    href: IMPERMAX_REDDIT_LINK,
    // eslint-disable-next-line react/display-name
    icon: (props: React.ComponentPropsWithRef<'svg'>) => (
      <RedditLogoIcon
        width={18}
        height={17}
        {...props} />
    )
  },
  {
    name: 'Twitter',
    href: IMPERMAX_TWITTER_LINK,
    // eslint-disable-next-line react/display-name
    icon: (props: React.ComponentPropsWithRef<'svg'>) => (
      <TwitterLogoIcon
        width={24}
        height={24}
        {...props} />
    )
  },
  {
    name: 'GitHub',
    href: IMPERMAX_GIT_HUB_LINK,
    // eslint-disable-next-line react/display-name
    icon: (props: React.ComponentPropsWithRef<'svg'>) => (
      <GitHubLogoIcon
        width={24}
        height={24}
        {...props} />
    )
  }
];

const LowerPart = (): JSX.Element => (
  <div
    className={clsx(
      'py-4',
      'md:flex',
      'md:items-center',
      'md:justify-between'
    )}>
    <div
      className={clsx(
        'flex',
        'space-x-6',
        'md:order-2',
        'items-center'
      )}>
      {SOCIAL_ITEMS.map(item => (
        <a
          key={item.name}
          href={item.href}
          className={clsx(
            'text-gray-400',
            'hover:text-textSecondary'
          )}
          target='_blank'
          rel='noopener noreferrer'>
          <span className='sr-only'>{item.name}</span>
          <item.icon aria-hidden='true' />
        </a>
      ))}
    </div>
    <p
      className={clsx(
        'mt-8',
        'text-base',
        'text-gray-400',
        'md:mt-0',
        'md:order-1'
      )}>
      &copy; {getCurrentYear()} IMPERMAX, Inc. All rights reserved.
    </p>
  </div>
);

export default LowerPart;
