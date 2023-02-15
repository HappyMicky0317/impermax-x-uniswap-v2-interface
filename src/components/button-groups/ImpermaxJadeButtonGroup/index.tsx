
import clsx from 'clsx';

import ImpermaxButtonBase, { Props as ImpermaxButtonBaseProps } from 'components/UI/ImpermaxButtonBase';
import { ReactComponent as SpinIcon } from 'assets/images/icons/spin.svg';

const ImpermaxJadeButtonGroup = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span
    className={clsx(
      'z-0',
      'inline-flex',
      'shadow-sm',
      'rounded-md',
      className
    )}
    {...rest} />
);

interface CustomImpermaxJadeButtonGroupItem {
  pending?: boolean;
}

const ImpermaxJadeButtonGroupItem = ({
  className,
  children,
  disabled = false,
  pending = false,
  ...rest
}: CustomImpermaxJadeButtonGroupItem & ImpermaxButtonBaseProps): JSX.Element => {
  const disabledOrPending = disabled || pending;

  return (
    <ImpermaxButtonBase
      style={{
        height: 38
      }}
      type='button'
      className={clsx(
        'focus:outline-none',
        'focus:ring-2',
        'focus:border-impermaxJade-300',
        'focus:ring-impermaxJade-200',
        'focus:ring-opacity-50',

        'border',
        'border-gray-300',
        'font-medium',
        'shadow-sm',
        'text-white',
        'bg-impermaxJade-600',
        'hover:bg-impermaxJade-700',

        'first:rounded-l',
        'last:rounded-r',
        'px-4',
        'py-2',
        'text-sm',
        '-ml-px',
        className
      )}
      disabled={disabledOrPending}
      {...rest}>
      {pending && (
        <SpinIcon
          className={clsx(
            'animate-spin',
            'w-5',
            'h-5',
            'mr-3'
          )} />
      )}
      {children}
    </ImpermaxButtonBase>
  );
};

export {
  ImpermaxJadeButtonGroupItem
};

export default ImpermaxJadeButtonGroup;
