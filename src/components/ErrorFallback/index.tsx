
import clsx from 'clsx';

import ImpermaxLink from 'components/UI/ImpermaxLink';

interface Props {
  error: Error;
  resetErrorBoundary?: () => void;
}

const handleRefresh = () => {
  window.location.reload();
};

const ErrorFallback = ({
  error,
  resetErrorBoundary
}: Props): JSX.Element => (
  <p
    className={clsx(
      'text-impermaxCarnation',
      'space-x-1'
    )}>
    <span>Error: {error.message}.</span>
    <span>
      Please&nbsp;
      <ImpermaxLink
        onClick={resetErrorBoundary ?? handleRefresh}
        className={clsx(
          'underline',
          'cursor-pointer'
        )}>
        refresh
      </ImpermaxLink>
      .
    </span>
  </p>
);

export default ErrorFallback;
