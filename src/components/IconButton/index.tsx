
import * as React from 'react';
import clsx from 'clsx';

import ImpermaxButtonBase, { Props as ImpermaxButtonBaseProps } from 'components/UI/ImpermaxButtonBase';
import { ReactComponent as SpinIcon } from 'assets/images/icons/spin.svg';

type CustomProps = {
  pending?: boolean;
}

type Ref = HTMLButtonElement;
const IconButton = React.forwardRef<Ref, Props>(({
  children,
  disabled = false,
  pending = false,
  className,
  ...rest
}, ref): JSX.Element => {
  const disabledOrPending = disabled || pending;

  return (
    <ImpermaxButtonBase
      ref={ref}
      className={clsx(
        'focus:outline-none',
        'focus:ring',
        'focus:border-primary-300',
        'focus:ring-primary-200',
        'focus:ring-opacity-50',

        'rounded-full',
        'justify-center',
        'hover:bg-black',
        'hover:bg-opacity-5',
        'dark:hover:bg-white',
        'dark:hover:bg-opacity-10',
        className
      )}
      disabled={disabledOrPending}
      {...rest}>
      {pending ? (
        <SpinIcon
          className={clsx(
            'animate-spin',
            'w-5',
            'h-5'
          )} />
      ) : children}
    </ImpermaxButtonBase>
  );
});
IconButton.displayName = 'IconButton';

export type Props = CustomProps & ImpermaxButtonBaseProps;

export default IconButton;
