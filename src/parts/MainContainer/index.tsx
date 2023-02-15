
import clsx from 'clsx';

const MainContainer = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'py-8',
      'space-y-10',
      className
    )}
    {...rest} />
);

export default MainContainer;
