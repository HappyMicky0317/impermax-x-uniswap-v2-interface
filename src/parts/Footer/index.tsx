
import * as React from 'react';
import clsx from 'clsx';

import UpperPart from './UpperPart';
import LowerPart from './LowerPart';
import { IS_STAKING_APP } from 'config/general';

type Ref = HTMLDivElement;
type Props = React.ComponentPropsWithRef<'footer'>;
const Footer = React.forwardRef<Ref, Props>(({
  className,
  ...rest
}, ref): JSX.Element => (
  <footer
    ref={ref}
    className={clsx(
      'border-t',
      'bg-impermaxBlackHaze',
      className
    )}
    aria-labelledby='footerHeading'
    {...rest}>
    <h2
      className='sr-only'>
      Footer
    </h2>
    <div
      className={clsx(
        'container',
        'mx-auto',
        'px-4',
        'sm:px-6',
        'lg:px-8',
        'py-4',
        'space-y-8',
        'divide-y',
        'divide-gray-200'
      )}>
      {!IS_STAKING_APP && <UpperPart />}
      <LowerPart />
    </div>
  </footer>
));
Footer.displayName = 'Footer';

export default Footer;
