
import * as React from 'react';
import clsx from 'clsx';

const ImpermaxLink = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'a'>): JSX.Element => (
  <a
    className={clsx(
      'hover:underline',
      className
    )}
    {...rest}>
    {children}
  </a>
);

export default ImpermaxLink;
