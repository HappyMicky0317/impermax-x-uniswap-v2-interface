
import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
  useQuery,
  useMutation,
  useQueryClient
} from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  formatUnits,
  parseUnits
} from '@ethersproject/units';
import {
  Zero,
  MaxUint256
} from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';
import {
  Contract,
  ContractTransaction,
  ContractReceipt
} from '@ethersproject/contracts';
import clsx from 'clsx';

import TokenAmountLabel from '../TokenAmountLabel';
import TokenAmountField from '../TokenAmountField';
import SubmitButton from '../SubmitButton';
import WalletConnectButton from 'containers/WalletConnectButton';
import ErrorFallback from 'components/ErrorFallback';
import ErrorModal from 'components/ErrorModal';
import {
  IMX_ADDRESSES,
  IMX_DECIMALS
} from 'config/web3/contracts/imxes';
import { X_IMX_ADDRESSES } from 'config/web3/contracts/x-imxes';
import { STAKING_ROUTER_ADDRESSES } from 'config/web3/contracts/staking-routers';
import useTokenBalance from 'services/hooks/use-token-balance';
import getERC20Contract from 'utils/helpers/web3/get-erc20-contract';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { STAKING_USER_DATA_FETCHER } from 'services/fetchers/staking-user-data-fetcher';
import { X_IMX_DATA_FETCHER } from 'services/fetchers/x-imx-data-fetcher';
import { RESERVES_DISTRIBUTOR_DATA_FETCHER } from 'services/fetchers/reserves-distributor-data-fetcher';
import ERC20JSON from 'abis/contracts/IERC20.json';
import StakingRouterJSON from 'abis/contracts/IStakingRouter.json';
import { useTransactionAdder } from 'store/transactions/hooks';

const getStakingRouterContract = (chainID: number, library: Web3Provider, account: string) => {
  const stakingRouterAddress = STAKING_ROUTER_ADDRESSES[chainID];
  const signer = library.getSigner(account);

  return new Contract(stakingRouterAddress, StakingRouterJSON.abi, signer);
};

const STAKING_AMOUNT = 'staking-amount';

type StakingFormData = {
  [STAKING_AMOUNT]: string;
}

const StakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  const {
    chainId,
    account,
    library,
    active
  } = useWeb3React<Web3Provider>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<StakingFormData>({
    mode: 'onChange'
  });

  const tokenAddress = chainId ? IMX_ADDRESSES[chainId] : undefined;
  const {
    isIdle: imxBalanceIdle,
    isLoading: imxBalanceLoading,
    isSuccess: imxBalanceSuccess,
    data: imxBalance,
    error: imxBalanceError,
    refetch: imxBalanceRefetch
  } = useTokenBalance(
    chainId,
    library,
    tokenAddress,
    account
  );
  useErrorHandler(imxBalanceError);

  const owner = account;
  const spender = chainId ? STAKING_ROUTER_ADDRESSES[chainId] : undefined;
  const {
    isIdle: imxAllowanceIdle,
    isLoading: imxAllowanceLoading,
    isSuccess: imxAllowanceSuccess,
    data: imxAllowance,
    error: imxAllowanceError,
    refetch: imxAllowanceRefetch
  } = useQuery<BigNumber, Error>(
    [
      GENERIC_FETCHER,
      chainId,
      tokenAddress,
      'allowance',
      owner,
      spender
    ],
    (chainId && library && tokenAddress && owner && spender) ?
      genericFetcher<BigNumber>(library, ERC20JSON.abi) :
      Promise.resolve,
    {
      enabled: !!(chainId && library && tokenAddress && owner && spender)
    }
  );
  useErrorHandler(imxAllowanceError);

  const approveMutation = useMutation<ContractReceipt, Error, string>(
    async () => {
      if (!chainId) {
        throw new Error('Invalid chain ID!');
      }
      if (!library) {
        throw new Error('Invalid library!');
      }
      if (!account) {
        throw new Error('Invalid account!');
      }

      const imxContract = getERC20Contract(IMX_ADDRESSES[chainId], library, account);
      const spender = STAKING_ROUTER_ADDRESSES[chainId];
      const tx: ContractTransaction = await imxContract.approve(spender, MaxUint256);
      return await tx.wait();
    },
    {
      onSuccess: (data, variables) => {
        addTransaction({
          hash: data.transactionHash
        }, {
          summary: `Approve of IMX (${variables}) transfer.`
        });
        imxAllowanceRefetch();
      }
    }
  );

  const queryClient = useQueryClient();
  const stakeMutation = useMutation<ContractReceipt, Error, string>(
    async (variables: string) => {
      if (!chainId) {
        throw new Error('Invalid chain ID!');
      }
      if (!library) {
        throw new Error('Invalid library!');
      }
      if (!account) {
        throw new Error('Invalid account!');
      }
      if (imxBalance === undefined) {
        throw new Error('Invalid IMX balance!');
      }
      if (imxAllowance === undefined) {
        throw new Error('Invalid IMX allowance!');
      }

      const bigStakingAmount = parseUnits(variables);
      const stakingRouterContract = getStakingRouterContract(chainId, library, account);
      const tx: ContractTransaction = await stakingRouterContract.stake(bigStakingAmount);
      return await tx.wait();
    },
    {
      onSuccess: (data, variables) => {
        addTransaction({
          hash: data.transactionHash
        }, {
          summary: `Stake IMX (${variables}).`
        });
        reset({
          [STAKING_AMOUNT]: ''
        });
        imxAllowanceRefetch();
        // Invalidations for Staked Balance & Unstaked Balance & Earned
        // Invalidations for Staking APY & Total IMX Staked & Total IMX Distributed
        imxBalanceRefetch();
        // TODO: could be abstracted
        const xIMXTokenAddress = chainId ? X_IMX_ADDRESSES[chainId] : undefined;
        queryClient.invalidateQueries([
          GENERIC_FETCHER,
          chainId,
          xIMXTokenAddress,
          'balanceOf',
          account
        ]);
        queryClient.invalidateQueries([
          X_IMX_DATA_FETCHER,
          chainId
        ]);
        queryClient.invalidateQueries([
          STAKING_USER_DATA_FETCHER,
          chainId,
          account
        ]);
        queryClient.invalidateQueries([
          RESERVES_DISTRIBUTOR_DATA_FETCHER,
          chainId
        ]);
      }
    }
  );

  const addTransaction = useTransactionAdder();

  const onApprove = async (data: StakingFormData) => {
    approveMutation.mutate(data[STAKING_AMOUNT]);
  };

  const onStake = async (data: StakingFormData) => {
    stakeMutation.mutate(data[STAKING_AMOUNT]);
  };

  const validateForm = (value: string): string | undefined => {
    if (imxBalance === undefined) {
      throw new Error('Invalid IMX balance!');
    }
    if (imxAllowance === undefined) {
      throw new Error('Invalid IMX allowance!');
    }

    const bigStakingAmount = parseUnits(value);
    if (bigStakingAmount.gt(imxBalance)) {
      return 'Staking amount must be less than your IMX balance!';
    }

    if (imxAllowance.gt(Zero) && bigStakingAmount.gt(imxAllowance)) {
      return 'Staking amount must be less than allowance!';
    }

    if (bigStakingAmount.lte(Zero)) {
      return 'Staking amount must be greater than zero!';
    }

    return undefined;
  };

  let approved: boolean | undefined;
  let floatIMXBalance: number | undefined;
  let floatIMXAllowance: number | undefined;
  let submitButtonText: string | undefined;
  if (imxBalanceSuccess && imxAllowanceSuccess) {
    if (imxBalance === undefined) {
      throw new Error('Invalid IMX balance!');
    }
    if (imxAllowance === undefined) {
      throw new Error('Invalid IMX allowance!');
    }

    approved = imxAllowance.gt(Zero);
    submitButtonText = approved ? 'Stake' : 'Approve';
    floatIMXBalance = formatNumberWithFixedDecimals(2)(parseFloat(formatUnits(imxBalance, IMX_DECIMALS)));
    floatIMXAllowance = formatNumberWithFixedDecimals(2)(parseFloat(formatUnits(imxAllowance, IMX_DECIMALS)));
  }
  if (imxBalanceIdle || imxBalanceLoading || imxAllowanceIdle || imxAllowanceLoading) {
    submitButtonText = 'Loading...';
  }

  const inputMaxValue = () => {
    if (!floatIMXBalance) return;

    reset({
      [STAKING_AMOUNT]: floatIMXBalance.toString()
    });
  };

  return (
    <>
      <form
        onSubmit={
          (imxBalanceSuccess && imxAllowanceSuccess) ?
            handleSubmit(approved ? onStake : onApprove) :
            undefined
        }
        {...props}>
        <TokenAmountLabel
          htmlFor={STAKING_AMOUNT}
          text='Stake IMX' />
        <TokenAmountField
          id={STAKING_AMOUNT}
          {...register(STAKING_AMOUNT, {
            required: {
              value: true,
              message: 'This field is required!'
            },
            validate: value => validateForm(value)
          })}
          inputMaxValue={inputMaxValue}
          balance={floatIMXBalance}
          allowance={floatIMXAllowance}
          error={!!errors[STAKING_AMOUNT]}
          helperText={errors[STAKING_AMOUNT]?.message}
          tokenSymbol='IMX'
          walletActive={active}
          disabled={!imxAllowance || !imxBalance} />
        {active ? (
          <SubmitButton
            disabled={imxBalanceIdle || imxBalanceLoading || imxAllowanceIdle || imxAllowanceLoading}
            pending={approveMutation.isLoading || stakeMutation.isLoading}>
            {submitButtonText}
          </SubmitButton>
        ) : (
          <WalletConnectButton
            style={{
              height: 56
            }}
            className={clsx(
              'w-full',
              'text-lg'
            )} />
        )}
      </form>
      {(approveMutation.isError || stakeMutation.isError) && (
        <ErrorModal
          open={approveMutation.isError || stakeMutation.isError}
          onClose={() => {
            if (approveMutation.isError) {
              approveMutation.reset();
            }
            if (stakeMutation.isError) {
              stakeMutation.reset();
            }
          }}
          title='Error'
          description={
            approveMutation.error?.message || stakeMutation.error?.message || ''
          } />
      )}
    </>
  );
};

export default withErrorBoundary(StakingForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
