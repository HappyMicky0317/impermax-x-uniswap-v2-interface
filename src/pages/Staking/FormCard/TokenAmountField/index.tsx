
import * as React from 'react';
import clsx from 'clsx';

import ImpermaxInput, { Props as ImpermaxInputProps } from 'components/UI/ImpermaxInput';
import ImpermaxMirageContainedButton from 'components/buttons/ImpermaxMirageContainedButton';
import formatNumberWithComma from 'utils/helpers/format-number-with-comma';

interface CustomProps {
  inputMaxValue: () => void;
  balance: number | undefined;
  allowance: number | undefined;
  error?: boolean;
  helperText?: React.ReactNode | string;
  tokenSymbol: string;
  walletActive: boolean;
}

type Ref = HTMLInputElement;
const TokenAmountField = React.forwardRef<Ref, CustomProps & ImpermaxInputProps>(({
  className,
  inputMaxValue,
  balance,
  error,
  helperText,
  tokenSymbol,
  walletActive,
  ...rest
}, ref): JSX.Element => {
  let balanceLabel;
  if (walletActive) {
    balanceLabel =
      balance === undefined ?
        'Loading...' :
        formatNumberWithComma(balance);
  } else {
    balanceLabel = '-';
  }

  return (
    <div
      className={clsx(
        'space-y-0.5',
        'flex',
        'flex-col'
      )}>
      <TokenAmountFieldHelperText
        style={{
          minWidth: 120
        }}
        className={clsx(
          'self-end',
          'inline-block'
        )}>
        Available: {balanceLabel} {tokenSymbol}
      </TokenAmountFieldHelperText>
      <div
        className={clsx(
          'flex',
          'rounded-md',
          'relative'
        )}>
        <ImpermaxMirageContainedButton
          onClick={inputMaxValue}
          className={clsx(
            'absolute',
            'top-1/2',
            'transform',
            '-translate-y-1/2',
            'left-0',
            'ml-3',
            'h-8',
            '!px-2'
          )}>
          MAX
        </ImpermaxMirageContainedButton>
        <ImpermaxInput
          ref={ref}
          className={clsx(
            'h-14',
            'text-2xl',
            'shadow-none',
            'rounded-r-none',
            'text-right',
            className
          )}
          title='Token Amount'
          type='number'
          step='any'
          pattern='[-+]?[0-9]*[.,]?[0-9]+'
          placeholder='0.00'
          min={0}
          minLength={1}
          maxLength={79}
          spellCheck='false'
          {...rest} />
        <div
          style={{
            minWidth: 60
          }}
          className={clsx(
            'rounded-r-md',
            'inline-flex',
            'flex',
            'justify-center',
            'items-center',
            'px-3',
            'py-2',
            'text-textSecondary',
            'text-sm',
            'border',
            'border-l-0',
            'border-gray-300',
            'bg-impermaxBlackHaze',
            'whitespace-nowrap',
            'select-none'
          )}>
          <span
            className={clsx(
              'truncate',
              'font-medium'
            )}>
            {tokenSymbol}
          </span>
        </div>
      </div>
      <TokenAmountFieldHelperText
        className={clsx(
          'h-6',
          'flex',
          'items-center',
          { 'text-impermaxCarnation': error }
        )}>
        {helperText}
      </TokenAmountFieldHelperText>
    </div>
  );
});
TokenAmountField.displayName = 'TokenAmountField';

const TokenAmountFieldHelperText = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'p'>): JSX.Element => (
  <p
    className={clsx(
      'text-sm',
      className
    )}
    {...rest} />
);

export default TokenAmountField;
