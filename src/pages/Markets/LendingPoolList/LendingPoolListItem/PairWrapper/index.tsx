
import clsx from 'clsx';

const PairWrapper = ({
  className,
  children
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'flex',
      'flex-col',
      'space-y-1',
      className
    )}>
    {children}
  </div>
);

export default PairWrapper;
