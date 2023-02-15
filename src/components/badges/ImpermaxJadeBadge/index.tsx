
import clsx from 'clsx';

const ImpermaxJadeBadge = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span
    className={clsx(
      'inline-flex',
      'items-center',
      'px-3',
      'py-0.5',
      'rounded-full',
      'text-sm',
      'font-medium',
      'bg-impermaxJade-100',
      'text-impermaxJade-800',
      className
    )}
    {...rest} />
);

export default ImpermaxJadeBadge;
