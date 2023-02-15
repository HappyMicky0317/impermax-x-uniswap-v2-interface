
import clsx from 'clsx';

const PropertyLabel = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'h5'>): JSX.Element => (
  <h5
    className={clsx(
      'text-textSecondary',
      'font-medium',
      'text-sm',
      className
    )}
    {...rest}>
    {children}
  </h5>
);

export default PropertyLabel;
