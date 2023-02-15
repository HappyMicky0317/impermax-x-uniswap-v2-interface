
import * as React from 'react';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import clsx from 'clsx';
import { useQuery } from 'react-query';

import ImpermaxJadeBadge from 'components/badges/ImpermaxJadeBadge';
import ErrorFallback from 'components/ErrorFallback';
import { CHAIN_IDS } from 'config/web3/chains';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import xIMXDataFetcher, {
  XIMXData,
  X_IMX_DATA_FETCHER
} from 'services/fetchers/x-imx-data-fetcher';

// TODO: not used for now
// import { formatUnits } from '@ethersproject/units';
// import { BigNumber } from '@ethersproject/bignumber';
// import { Contract } from '@ethersproject/contracts';
// import {
//   X_IMX_ADDRESSES,
//   X_IMX_DECIMALS
// } from 'config/web3/contracts/x-imxes';
// import STATUSES from 'utils/constants/statuses';
// import PoolTokenJSON from 'abis/contracts/IPoolToken.json';
// const getXIMXContract = (xIMXAddress: string, library: Web3Provider) => {
//   return new Contract(xIMXAddress, PoolTokenJSON.abi, library);
// };
// const xIMXContract = getXIMXContract(X_IMX_ADDRESSES[chainId], library);
// const bigXIMXRate: BigNumber = await mounted(xIMXContract.callStatic.exchangeRate());
// const floatXIMXRate = parseFloat(formatUnits(bigXIMXRate, X_IMX_DECIMALS));
// const xIMXRate = formatNumberWithFixedDecimals(6)(floatXIMXRate);

interface CustomProps {
  text: string;
}

const TokenAmountLabel = ({
  text,
  className,
  ...rest
}: CustomProps & Omit<React.ComponentPropsWithRef<'label'>, 'children'>): JSX.Element => {
  const {
    chainId = CHAIN_IDS.ETHEREUM_MAIN_NET
  } = useWeb3React<Web3Provider>();

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

  let xIMXRateLabel: string | number = '-';
  if (xIMXDataLoading) {
    xIMXRateLabel = 'Loading...';
  } else {
    if (xIMXData === undefined) {
      throw new Error('Something went wrong!');
    }

    xIMXRateLabel = Number(xIMXData.exchangeRate);
    xIMXRateLabel = formatNumberWithFixedDecimals(6)(xIMXRateLabel);
  }

  return (
    <label
      className={clsx(
        'flex',
        'justify-between',
        'items-center',
        className
      )}
      {...rest}>
      <span
        className={clsx(
          'text-2xl',
          'font-medium'
        )}>
        {text}
      </span>
      <ImpermaxJadeBadge>1 xIMX = {xIMXRateLabel} IMX</ImpermaxJadeBadge>
    </label>
  );
};

export default withErrorBoundary(TokenAmountLabel, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
