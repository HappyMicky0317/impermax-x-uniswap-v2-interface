
import clsx from 'clsx';

const Panel = ({
  className,
  ...rest
}: Props): JSX.Element => (
  <div
    className={clsx(
      'shadow',
      'overflow-hidden',
      'md:rounded',
      className
    )}
    {...rest} />
);

export type Props = React.ComponentPropsWithRef<'div'>;

export default Panel;
