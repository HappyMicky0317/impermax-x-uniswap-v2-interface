
import clsx from 'clsx';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';

import Panel, { Props as PanelProps } from 'components/Panel';
import ErrorFallback from 'components/ErrorFallback';
import {
  X_IMX_ADDRESSES,
  X_IMX_DECIMALS
} from 'config/web3/contracts/x-imxes';
import {
  IMX_ADDRESSES,
  IMX_DECIMALS
} from 'config/web3/contracts/imxes';
import useTokenBalance from 'services/hooks/use-token-balance';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import formatNumberWithComma from 'utils/helpers/format-number-with-comma';
import xIMXDataFetcher, {
  XIMXData,
  X_IMX_DATA_FETCHER
} from 'services/fetchers/x-imx-data-fetcher';
import stakingUserDataFetcher, {
  StakingUserData,
  STAKING_USER_DATA_FETCHER
} from 'services/fetchers/staking-user-data-fetcher';

interface BalanceItemProps {
  label: string;
  value: string;
  tokenSymbol: string;
}

const BalanceItem = ({
  label,
  value,
  tokenSymbol
}: BalanceItemProps) => (
  <div className='space-y-3'>
    <h4
      className={clsx(
        'text-xl',
        'font-medium'
      )}>
      {label}
    </h4>
    <div
      className={clsx(
        'flex',
        'items-center',
        'space-x-1',
        'text-xl',
        'font-bold'
      )}>
      <span>
        {value}
      </span>
      <span>
        {tokenSymbol}
      </span>
    </div>
  </div>
);

const BalanceCard = ({
  className,
  ...rest
}: PanelProps): JSX.Element => {
  const {
    chainId,
    library,
    account,
    active
  } = useWeb3React<Web3Provider>();

  const imxTokenAddress = chainId ? IMX_ADDRESSES[chainId] : undefined;
  const {
    isLoading: imxBalanceLoading,
    data: imxBalance,
    error: imxBalanceError
  } = useTokenBalance(
    chainId,
    library,
    imxTokenAddress,
    account
  );
  useErrorHandler(imxBalanceError);

  const xIMXTokenAddress = chainId ? X_IMX_ADDRESSES[chainId] : undefined;
  const {
    isLoading: xIMXBalanceLoading,
    data: xIMXBalance,
    error: xIMXBalanceError
  } = useTokenBalance(
    chainId,
    library,
    xIMXTokenAddress,
    account
  );
  useErrorHandler(xIMXBalanceError);

  const {
    isLoading: xIMXDataLoading,
    data: xIMXData,
    error: xIMXDataError
  } = useQuery<XIMXData, Error>(
    [
      X_IMX_DATA_FETCHER,
      chainId
    ],
    xIMXDataFetcher,
    {
      enabled: chainId !== undefined
    }
  );
  useErrorHandler(xIMXDataError);

  const {
    isLoading: stakingUserDataLoading,
    data: stakingUserData,
    error: stakingUserDataError
  } = useQuery<StakingUserData, Error>(
    [
      STAKING_USER_DATA_FETCHER,
      chainId,
      account
    ],
    stakingUserDataFetcher,
    {
      enabled: chainId !== undefined && account !== undefined
    }
  );
  useErrorHandler(stakingUserDataError);

  let stakedBalanceLabel;
  let unstakedBalanceLabel;
  let earnedLabel;
  if (active) {
    if (xIMXBalanceLoading || xIMXDataLoading) {
      stakedBalanceLabel = 'Loading...';
    } else {
      if (xIMXBalance === undefined) {
        throw new Error('Something went wrong!');
      }
      if (xIMXData === undefined) {
        throw new Error('Something went wrong!');
      }

      const xIMXRate = parseFloat(xIMXData.exchangeRate);
      const floatXIMXBalance = parseFloat(formatUnits(xIMXBalance, X_IMX_DECIMALS));
      stakedBalanceLabel = formatNumberWithFixedDecimals(2)(floatXIMXBalance * xIMXRate);
      stakedBalanceLabel = formatNumberWithComma(stakedBalanceLabel);
    }

    if (imxBalanceLoading) {
      unstakedBalanceLabel = 'Loading...';
    } else {
      if (imxBalance === undefined) {
        throw new Error('Something went wrong!');
      }

      unstakedBalanceLabel = parseFloat(formatUnits(imxBalance, IMX_DECIMALS));
      unstakedBalanceLabel = formatNumberWithFixedDecimals(2)(unstakedBalanceLabel);
      unstakedBalanceLabel = formatNumberWithComma(unstakedBalanceLabel);
    }

    if (stakingUserDataLoading || xIMXDataLoading) {
      earnedLabel = 'Loading...';
    } else {
      if (stakingUserData === undefined) {
        throw new Error('Something went wrong!');
      }
      if (xIMXData === undefined) {
        throw new Error('Something went wrong!');
      }

      const xIMXRate = parseFloat(xIMXData.exchangeRate);
      const totalEarned = parseFloat(stakingUserData?.totalEarned ?? 0);
      const anotherXIMXBalance = parseFloat(stakingUserData?.ximxBalance ?? 0);
      const lastExchangeRate = parseFloat(stakingUserData?.lastExchangeRate ?? 0);
      earnedLabel = totalEarned + anotherXIMXBalance * (xIMXRate - lastExchangeRate);
      earnedLabel = formatNumberWithFixedDecimals(2)(earnedLabel);
      earnedLabel = formatNumberWithComma(earnedLabel);
    }
  } else {
    stakedBalanceLabel = '-';
    unstakedBalanceLabel = '-';
    earnedLabel = '-';
  }

  return (
    <Panel
      className={clsx(
        'px-8',
        'py-7',
        'space-y-8',
        'bg-white',
        className
      )}
      {...rest}>
      <BalanceItem
        label='Staked Balance'
        value={stakedBalanceLabel}
        tokenSymbol='IMX' />
      <BalanceItem
        label='Unstaked Balance'
        value={unstakedBalanceLabel}
        tokenSymbol='IMX' />
      <BalanceItem
        label='Earned'
        value={earnedLabel}
        tokenSymbol='IMX' />
    </Panel>
  );
};

export default withErrorBoundary(BalanceCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
