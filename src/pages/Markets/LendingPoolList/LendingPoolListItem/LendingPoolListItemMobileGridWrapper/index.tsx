
import clsx from 'clsx';

const LendingPoolListItemMobileGridWrapper = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'grid',
      'grid-cols-3',
      'gap-x-4',
      className
    )}
    {...rest} />
);

export default LendingPoolListItemMobileGridWrapper;
