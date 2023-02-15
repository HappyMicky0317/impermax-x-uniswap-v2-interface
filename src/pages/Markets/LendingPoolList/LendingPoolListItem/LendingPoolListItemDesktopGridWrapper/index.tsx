
import clsx from 'clsx';

const LendingPoolListItemDesktopGridWrapper = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'grid',
      'grid-cols-8',
      'gap-x-4',
      className
    )}
    {...rest} />
);

export default LendingPoolListItemDesktopGridWrapper;
