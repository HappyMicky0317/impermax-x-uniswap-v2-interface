
import * as React from 'react';
import {
  Listbox,
  Transition
} from '@headlessui/react';
import { Props } from '@headlessui/react/dist/types';
import clsx from 'clsx';
import {
  CheckIcon,
  SelectorIcon
} from '@heroicons/react/solid';

type SelectLabelProps = Props<typeof Listbox.Label>;

const SelectLabel = ({
  className,
  ...rest
}: SelectLabelProps): JSX.Element => (
  <Listbox.Label
    className={clsx(
      'block',
      'text-sm',
      'font-medium',
      'text-gray-700',
      'mb-1',
      className
    )}
    {...rest} />
);

type SelectButtonProps = Props<typeof Listbox.Button>;

const SelectButton = ({
  className,
  children,
  ...rest
}: SelectButtonProps): JSX.Element => (
  <Listbox.Button
    className={clsx(
      'focus:outline-none',
      'focus:ring',
      'focus:border-primary-300',
      'focus:ring-primary-200',
      'focus:ring-opacity-50',

      'relative',
      'w-full',
      'bg-white',
      'border',
      'border-gray-300',
      'rounded-md',
      'shadow-sm',
      'pl-3',
      'pr-10',
      'py-2',
      'text-left',
      'cursor-default',
      'sm:text-sm',
      className
    )}
    {...rest}>
    {children}
    <span
      className={clsx(
        'ml-3',
        'absolute',
        'inset-y-0',
        'right-0',
        'flex',
        'items-center',
        'pr-2',
        'pointer-events-none'
      )}>
      <SelectorIcon
        className={clsx(
          'h-5',
          'w-5',
          'text-gray-400'
        )}
        aria-hidden='true' />
    </span>
  </Listbox.Button>
);

interface CustomSelectOptionsProps {
  open: boolean;
}

type SelectOptionsProps = CustomSelectOptionsProps & Props<typeof Listbox.Options>;

const SelectOptions = ({
  open,
  className,
  ...rest
}: SelectOptionsProps): JSX.Element => (
  <Transition
    show={open}
    as={React.Fragment}
    leave={clsx(
      'transition',
      'ease-in',
      'duration-100'
    )}
    leaveFrom='opacity-100'
    leaveTo='opacity-0'>
    <Listbox.Options
      static
      className={clsx(
        'absolute',
        'z-impermaxSpeedDial',
        'mt-1',
        'w-full',
        'bg-white',
        'shadow-lg',
        'max-h-56',
        'rounded-md',
        'py-1',
        'text-base',
        'ring-1',
        'ring-black',
        'ring-opacity-5',
        'overflow-auto',
        'focus:outline-none',
        'sm:text-sm',
        className
      )}
      {...rest} />
  </Transition>
);

type SelectOptionProps = Props<typeof Listbox.Option>;

const SelectOption = ({
  value,
  className,
  ...rest
}: SelectOptionProps): JSX.Element => (
  <Listbox.Option
    className={({ active }) =>
      clsx(
        active ?
          clsx(
            'text-white',
            'bg-impermaxJade-600'
          ) :
          'text-gray-900',
        'cursor-default',
        'select-none',
        'relative',
        'py-2',
        'pl-3',
        'pr-9',
        className
      )
    }
    value={value}
    {...rest} />
);

const SelectBody = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'relative',
      className
    )}
    {...rest} />
);

interface CustomSelectCheckProps {
  active: boolean;
}

const SelectCheck = ({
  active,
  className,
  ...rest
}: CustomSelectCheckProps & React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span
    className={clsx(
      active ?
        'text-white' :
        'text-impermaxJade-600',
      'absolute',
      'inset-y-0',
      'right-0',
      'flex',
      'items-center',
      'pr-4',
      className
    )}
    {...rest}>
    <CheckIcon
      className={clsx(
        'h-5',
        'w-5'
      )}
      aria-hidden='true' />
  </span>
);

interface CustomSelectTextProps {
  selected?: boolean;
}

const SelectText = ({
  selected = false,
  className,
  ...rest
}: CustomSelectTextProps & React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span
    className={clsx(
      selected ?
        'font-semibold' :
        'font-normal',
      'block',
      'truncate',
      className
    )}
    {...rest} />
);

const Select = ({
  value,
  onChange,
  children
}: SelectProps): JSX.Element => {
  return (
    <Listbox
      value={value}
      onChange={onChange}>
      {children}
    </Listbox>
  );
};

export type SelectProps = Props<typeof Listbox>;

export {
  SelectLabel,
  SelectButton,
  SelectOptions,
  SelectOption,
  SelectBody,
  SelectCheck,
  SelectText
};

export default Select;
