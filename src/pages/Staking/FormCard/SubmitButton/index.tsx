
import clsx from 'clsx';

import ImpermaxAstralContainedButton, {
  Props as ImpermaxAstralContainedButtonProps
} from 'components/buttons/ImpermaxAstralContainedButton';

const SubmitButton = ({
  className,
  style,
  ...rest
}: ImpermaxAstralContainedButtonProps): JSX.Element => (
  <ImpermaxAstralContainedButton
    type='submit'
    style={{
      height: 56,
      ...style
    }}
    className={clsx(
      'w-full',
      'text-lg',
      className
    )}
    {...rest} />
);

export default SubmitButton;
