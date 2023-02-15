
import * as React from 'react';
import clsx from 'clsx';

import ImpermaxButtonBase, { Props as ImpermaxButtonBaseProps } from 'components/UI/ImpermaxButtonBase';
import { ReactComponent as SpinIcon } from 'assets/images/icons/spin.svg';

interface CustomProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  pending?: boolean;
}

type Ref = HTMLButtonElement;
const ImpermaxJadeContainedButton = React.forwardRef<Ref, Props>(({
  className,
  children,
  startIcon,
  endIcon,
  disabled = false,
  pending = false,
  ...rest
}, ref): JSX.Element => {
  const disabledOrPending = disabled || pending;

  return (
    <ImpermaxButtonBase
      ref={ref}
      type='button'
      className={clsx(
        'focus:outline-none',
        'focus:ring',
        'focus:border-impermaxJade-300',
        'focus:ring-impermaxJade-200',
        'focus:ring-opacity-50',

        'border',
        'border-transparent',
        'font-medium',
        'shadow-sm',

        disabledOrPending ? clsx(
          'bg-black',
          'bg-opacity-10',
          'text-black',
          'text-opacity-25',
          'dark:text-white',
          'dark:text-opacity-30'
        ) : clsx(
          'text-white',
          'bg-impermaxJade-600',
          'hover:bg-impermaxJade-700'
        ),

        'rounded',
        'px-4',
        'py-2',
        'text-sm',
        'space-x-1.5',
        'justify-center',
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
      {startIcon}
      <span>
        {children}
      </span>
      {endIcon}
    </ImpermaxButtonBase>
  );
});
ImpermaxJadeContainedButton.displayName = 'ImpermaxJadeContainedButton';

export type Props = CustomProps & ImpermaxButtonBaseProps;

export default ImpermaxJadeContainedButton;
