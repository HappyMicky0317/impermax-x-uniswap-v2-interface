
import clsx from 'clsx';

import { ReactComponent as SpinIcon } from 'assets/images/icons/spin.svg';

const LineLoadingSpinner = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'p-7',
      'flex',
      'justify-center',
      className
    )}
    {...rest}>
    <SpinIcon
      className={clsx(
        'animate-spin',
        'w-8',
        'h-8',
        'text-impermaxJade'
      )} />
  </div>
);

export default LineLoadingSpinner;
