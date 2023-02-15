
import clsx from 'clsx';

// TODO: not used for now
const ImpermaxCarnationBadge = ({
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
      'bg-impermaxCarnation-100',
      'text-impermaxCarnation-800',
      className
    )}
    {...rest} />
);

export default ImpermaxCarnationBadge;
