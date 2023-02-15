
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import { Log } from '@ethersproject/abstract-provider';
import { Interface } from '@ethersproject/abi';
import { AddressZero } from '@ethersproject/constants';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';

import AccountLendingPoolPageSelector from './AccountLendingPoolPageSelector';
import AccountLendingPoolLPRow from './AccountLendingPoolLPRow';
import AccountLendingPoolBorrowRow from './AccountLendingPoolBorrowRow';
import AccountLendingPoolSupplyRow from './AccountLendingPoolSupplyRow';
import AccountLendingPoolDetailsLeverage from './AccountLendingPoolDetailsLeverage';
import AccountLendingPoolDetailsEarnInterest from './AccountLendingPoolDetailsEarnInterest';
import AccountLendingPoolFarming from './AccountLendingPoolFarming';
import OracleAlert from './OracleAlert';
import Panel from 'components/Panel';
import ErrorFallback from 'components/ErrorFallback';
import ImpermaxJadeContainedButton from 'components/buttons/ImpermaxJadeContainedButton';
import PoolTokenContext from 'contexts/PoolToken';
import { SIMPLE_UNISWAP_ORACLE_ADDRESSES } from 'config/web3/contracts/simple-uniswap-oracles';
import {
  DUST,
  UI_MARGIN
} from 'config/general';
import { injected } from 'utils/helpers/web3/connectors';
import {
  getLendingPoolTokenPriceInUSD,
  getLendingPoolTokenSupplyAPY,
  getLendingPoolTokenSymbol,
  getLendingPoolTokenIconPath
} from 'utils/helpers/lending-pools';
import { PARAMETERS } from 'utils/constants/links';
import getValuesFromPrice from 'utils/helpers/get-values-from-price';
import useLendingPool from 'services/hooks/use-lending-pool';
import useTokenDeposited from 'services/hooks/use-token-deposited';
import useTokenBorrowBalance from 'services/hooks/use-token-borrow-balance';
import usePriceDenomLP from 'services/hooks/use-price-denom-lp';
import useFarmingPoolAddresses from 'services/hooks/use-farming-pool-addresses';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import claimLogsFetcher, { CLAIM_LOGS_FETCHER } from 'services/fetchers/claim-logs-fetcher';
import SimpleUniswapOracleJSON from 'abis/contracts/ISimpleUniswapOracle.json';
import UniswapV2PairJSON from 'abis/contracts/IUniswapV2Pair.json';
import FarmingPoolJSON from 'abis/contracts/IFarmingPool.json';
import { PoolTokenType } from 'types/interfaces';
import './index.scss';

interface AccountLendingPoolContainerProps {
  children: React.ReactNode;
}

const AccountLendingPoolContainer = ({ children }: AccountLendingPoolContainerProps) => {
  return (
    <Panel className='bg-white'>
      {children}
    </Panel>
  );
};

/**
 * Generate the Account Lending Pool card, giving details about the particular user's equity in the pool.
 * @params AccountLendingPoolProps
 */

const AccountLendingPool = (): JSX.Element => {
  const {
    [PARAMETERS.CHAIN_ID]: selectedChainIDParam,
    [PARAMETERS.UNISWAP_V2_PAIR_ADDRESS]: selectedUniswapV2PairAddress
  } = useParams<Record<string, string>>();
  const selectedChainID = Number(selectedChainIDParam);

  const {
    isLoading: selectedLendingPoolLoading,
    data: selectedLendingPool,
    error: selectedLendingPoolError
  } = useLendingPool(selectedUniswapV2PairAddress, selectedChainID);
  useErrorHandler(selectedLendingPoolError);

  const {
    library,
    account,
    activate
  } = useWeb3React<Web3Provider>();

  const {
    isLoading: tokenADepositedLoading,
    data: tokenADeposited,
    error: tokenADepositedError
  } = useTokenDeposited(
    selectedUniswapV2PairAddress,
    PoolTokenType.BorrowableA,
    selectedChainID,
    library,
    account
  );
  useErrorHandler(tokenADepositedError);
  const {
    isLoading: tokenBDepositedLoading,
    data: tokenBDeposited,
    error: tokenBDepositedError
  } = useTokenDeposited(
    selectedUniswapV2PairAddress,
    PoolTokenType.BorrowableB,
    selectedChainID,
    library,
    account
  );
  useErrorHandler(tokenBDepositedError);

  const [pageSelected, setPageSelected] = React.useState<AccountLendingPoolPage>(AccountLendingPoolPage.Uninitialized);

  const {
    isLoading: collateralDepositedLoading,
    data: collateralDeposited,
    error: collateralDepositedError
  } = useTokenDeposited(
    selectedUniswapV2PairAddress,
    PoolTokenType.Collateral,
    selectedChainID,
    library,
    account
  );
  useErrorHandler(collateralDepositedError);

  const {
    isLoading: tokenABorrowBalanceLoading,
    data: tokenABorrowBalance,
    error: tokenABorrowBalanceError
  } = useTokenBorrowBalance(
    selectedUniswapV2PairAddress,
    PoolTokenType.BorrowableA,
    selectedChainID,
    library,
    account
  );
  useErrorHandler(tokenABorrowBalanceError);
  const {
    isLoading: tokenBBorrowBalanceLoading,
    data: tokenBBorrowBalance,
    error: tokenBBorrowBalanceError
  } = useTokenBorrowBalance(
    selectedUniswapV2PairAddress,
    PoolTokenType.BorrowableB,
    selectedChainID,
    library,
    account
  );
  useErrorHandler(tokenBBorrowBalanceError);

  const {
    isLoading: priceObjLoading,
    data: priceObj,
    error: priceObjLoadingError
    // TODO: should type properly
  } = useQuery<any, Error>(
    [
      GENERIC_FETCHER,
      selectedChainID,
      SIMPLE_UNISWAP_ORACLE_ADDRESSES[selectedChainID],
      'getResult',
      selectedUniswapV2PairAddress
    ],
    library ?
      genericFetcher<any>(
        library,
        SimpleUniswapOracleJSON.abi,
        true
      ) :
      Promise.resolve,
    {
      enabled: !!library
    }
  );
  useErrorHandler(priceObjLoadingError);

  const {
    isLoading: priceDenomLPLoading,
    data: priceDenomLP,
    error: priceDenomLPError
  } = usePriceDenomLP(
    selectedUniswapV2PairAddress,
    selectedChainID,
    library
  );
  useErrorHandler(priceDenomLPError);

  const {
    isLoading: reservesLoading,
    data: reserves,
    error: reservesError
  } = useQuery<string, Error>(
    [
      GENERIC_FETCHER,
      selectedChainID,
      selectedUniswapV2PairAddress,
      'getReserves'
    ],
    library ?
      genericFetcher<string>(library, UniswapV2PairJSON.abi) :
      Promise.resolve,
    {
      enabled: !!library
    }
  );
  useErrorHandler(reservesError);

  const {
    isLoading: bigTotalSupplyLoading,
    data: bigTotalSupply,
    error: bigTotalSupplyError
  } = useQuery<string, Error>(
    [
      GENERIC_FETCHER,
      selectedChainID,
      selectedUniswapV2PairAddress,
      'totalSupply'
    ],
    library ?
      genericFetcher<string>(library, UniswapV2PairJSON.abi) :
      Promise.resolve,
    {
      enabled: !!library
    }
  );
  useErrorHandler(bigTotalSupplyError);

  const {
    isLoading: farmingPoolAddressesLoading,
    data: {
      farmingPoolAAddress,
      farmingPoolBAddress
    },
    error: farmingPoolAddressesError
  } = useFarmingPoolAddresses(selectedChainID, selectedUniswapV2PairAddress, library);
  useErrorHandler(farmingPoolAddressesError);
  const {
    isLoading: farmingPoolARecipientsLoading,
    data: farmingPoolARecipients = [Zero],
    error: farmingPoolARecipientsError
  } = useQuery<BigNumber[], Error>(
    [
      GENERIC_FETCHER,
      selectedChainID,
      farmingPoolAAddress,
      'recipients',
      account
    ],
    library ?
      genericFetcher<BigNumber[]>(library, FarmingPoolJSON.abi) :
      Promise.resolve,
    {
      enabled: !!library && AddressZero !== farmingPoolAAddress
    }
  );
  useErrorHandler(farmingPoolARecipientsError);
  const {
    isLoading: farmingPoolBRecipientsLoading,
    data: farmingPoolBRecipients = [Zero],
    error: farmingPoolBRecipientsError
  } = useQuery<BigNumber[], Error>(
    [
      GENERIC_FETCHER,
      selectedChainID,
      farmingPoolBAddress,
      'recipients',
      account
    ],
    library ?
      genericFetcher<BigNumber[]>(library, FarmingPoolJSON.abi) :
      Promise.resolve,
    {
      enabled: !!library && AddressZero !== farmingPoolBAddress
    }
  );
  useErrorHandler(farmingPoolBRecipientsError);

  const {
    isLoading: farmingPoolATotalAmountLoading,
    data: farmingPoolATotalAmount = Zero,
    error: farmingPoolATotalAmountError
  } = useQuery<BigNumber, Error>(
    [
      GENERIC_FETCHER,
      selectedChainID,
      farmingPoolAAddress,
      'claim'
    ],
    library ?
      genericFetcher<BigNumber>(library, FarmingPoolJSON.abi, true) :
      Promise.resolve,
    {
      enabled: !!library && AddressZero !== farmingPoolAAddress
    }
  );
  useErrorHandler(farmingPoolATotalAmountError);
  const {
    isLoading: farmingPoolBTotalAmountLoading,
    data: farmingPoolBTotalAmount = Zero,
    error: farmingPoolBTotalAmountError
  } = useQuery<BigNumber, Error>(
    [
      GENERIC_FETCHER,
      selectedChainID,
      farmingPoolBAddress,
      'claim'
    ],
    library ?
      genericFetcher<BigNumber>(library, FarmingPoolJSON.abi, true) :
      Promise.resolve,
    {
      enabled: !!library && AddressZero !== farmingPoolAAddress
    }
  );
  useErrorHandler(farmingPoolBTotalAmountError);

  const {
    isLoading: claimALogsLoading,
    data: claimALogs,
    error: claimALogsError
  } = useQuery<Array<Log>, Error>(
    [
      CLAIM_LOGS_FETCHER,
      farmingPoolAAddress,
      account
    ],
    library && account && farmingPoolAAddress ?
      () => claimLogsFetcher(library)(
        farmingPoolAAddress,
        account
      ) :
      Promise.resolve,
    {
      enabled:
        !!library &&
        !!account &&
        !!farmingPoolAAddress &&
        AddressZero !== farmingPoolAAddress
    }
  );
  useErrorHandler(claimALogsError);
  const {
    isLoading: claimBLogsLoading,
    data: claimBLogs,
    error: claimBLogsError
  } = useQuery<Array<Log>, Error>(
    [
      CLAIM_LOGS_FETCHER,
      farmingPoolBAddress,
      account
    ],
    library && account && farmingPoolBAddress ?
      () => claimLogsFetcher(library)(
        farmingPoolBAddress,
        account
      ) :
      Promise.resolve,
    {
      enabled:
        !!library &&
        !!account &&
        !!farmingPoolBAddress &&
        AddressZero !== farmingPoolBAddress
    }
  );
  useErrorHandler(claimBLogsError);

  if (!account) {
    return (
      <AccountLendingPoolContainer>
        <div className='text-center py-5'>
          <ImpermaxJadeContainedButton
            onClick={() => {
              // TODO: should handle properly
              activate(injected);
            }}
            className='button-green'>
            Connect to use the App
          </ImpermaxJadeContainedButton>
        </div>
      </AccountLendingPoolContainer>
    );
  }

  // TODO: should use skeleton loaders
  if (selectedLendingPoolLoading) {
    return <>Loading...</>;
  }
  if (tokenADepositedLoading) {
    return <>Loading...</>;
  }
  if (tokenBDepositedLoading) {
    return <>Loading...</>;
  }
  if (collateralDepositedLoading) {
    return <>Loading...</>;
  }
  if (tokenABorrowBalanceLoading) {
    return <>Loading...</>;
  }
  if (tokenBBorrowBalanceLoading) {
    return <>Loading...</>;
  }
  if (priceObjLoading) {
    return <>Loading...</>;
  }
  if (priceDenomLPLoading) {
    return <>Loading...</>;
  }
  if (reservesLoading) {
    return <>Loading...</>;
  }
  if (bigTotalSupplyLoading) {
    return <>Loading...</>;
  }
  if (farmingPoolAddressesLoading) {
    return <>Loading...</>;
  }
  if (farmingPoolARecipientsLoading) {
    return <>Loading...</>;
  }
  if (farmingPoolBRecipientsLoading) {
    return <>Loading...</>;
  }
  if (farmingPoolATotalAmountLoading) {
    return <>Loading...</>;
  }
  if (farmingPoolBTotalAmountLoading) {
    return <>Loading...</>;
  }
  if (claimALogsLoading) {
    return <>Loading...</>;
  }
  if (claimBLogsLoading) {
    return <>Loading...</>;
  }
  if (!priceObj?.[0]) {
    return (
      <OracleAlert />
    );
  }
  if (tokenADeposited === undefined) {
    throw new Error('Something went wrong!');
  }
  if (tokenBDeposited === undefined) {
    throw new Error('Something went wrong!');
  }
  if (selectedLendingPool === undefined) {
    throw new Error('Something went wrong!');
  }
  if (collateralDeposited === undefined) {
    throw new Error('Something went wrong!');
  }
  if (tokenABorrowBalance === undefined) {
    throw new Error('Something went wrong!');
  }
  if (tokenBBorrowBalance === undefined) {
    throw new Error('Something went wrong!');
  }
  if (priceDenomLP === undefined) {
    throw new Error('Something went wrong!');
  }
  if (reserves === undefined) {
    throw new Error('Something went wrong!');
  }
  if (bigTotalSupply === undefined) {
    throw new Error('Something went wrong!');
  }
  if (claimALogs === undefined) {
    throw new Error('Something went wrong!');
  }
  if (claimBLogs === undefined) {
    throw new Error('Something went wrong!');
  }

  const tokenAPriceInUSD = getLendingPoolTokenPriceInUSD(selectedLendingPool, PoolTokenType.BorrowableA);
  const tokenBPriceInUSD = getLendingPoolTokenPriceInUSD(selectedLendingPool, PoolTokenType.BorrowableB);

  const tokenADepositedInUSD = tokenADeposited * tokenAPriceInUSD;
  const tokenBDepositedInUSD = tokenBDeposited * tokenBPriceInUSD;
  const supplyBalanceInUSD = tokenADepositedInUSD + tokenBDepositedInUSD;

  const collateralPriceInUSD = getLendingPoolTokenPriceInUSD(selectedLendingPool, PoolTokenType.Collateral);
  const collateralDepositedInUSD = collateralDeposited * collateralPriceInUSD;

  const tokenASupplyAPY = getLendingPoolTokenSupplyAPY(selectedLendingPool, PoolTokenType.BorrowableA);
  const tokenBSupplyAPY = getLendingPoolTokenSupplyAPY(selectedLendingPool, PoolTokenType.BorrowableB);
  const accountAPY =
    supplyBalanceInUSD > 0 ?
      (tokenADepositedInUSD * tokenASupplyAPY + tokenBDepositedInUSD * tokenBSupplyAPY) / supplyBalanceInUSD :
      0;

  const tokenAAccrualTimestamp = parseFloat(selectedLendingPool[PoolTokenType.BorrowableA].accrualTimestamp);
  const tokenBAccrualTimestamp = parseFloat(selectedLendingPool[PoolTokenType.BorrowableB].accrualTimestamp);
  const tokenABorrowRate = parseFloat(selectedLendingPool[PoolTokenType.BorrowableA].borrowRate);
  const tokenBBorrowRate = parseFloat(selectedLendingPool[PoolTokenType.BorrowableB].borrowRate);
  const tokenABorrowed = tokenABorrowBalance * (1 + (Date.now() / 1000 - tokenAAccrualTimestamp) * tokenABorrowRate);
  const tokenBBorrowed = tokenBBorrowBalance * (1 + (Date.now() / 1000 - tokenBAccrualTimestamp) * tokenBBorrowRate);
  const tokenABorrowedInUSD = tokenABorrowed * tokenAPriceInUSD;
  const tokenBBorrowedInUSD = tokenBBorrowed * tokenBPriceInUSD;
  const debtInUSD = tokenABorrowedInUSD + tokenBBorrowedInUSD;
  const lpEquityInUSD = collateralDepositedInUSD - debtInUSD;

  const tokenASymbol = getLendingPoolTokenSymbol(selectedLendingPool, PoolTokenType.BorrowableA, selectedChainID);
  const tokenBSymbol = getLendingPoolTokenSymbol(selectedLendingPool, PoolTokenType.BorrowableB, selectedChainID);
  const collateralSymbol = getLendingPoolTokenSymbol(selectedLendingPool, PoolTokenType.Collateral, selectedChainID);

  const actualPageSelected =
    pageSelected === AccountLendingPoolPage.Uninitialized ?
      collateralDepositedInUSD > 0 || supplyBalanceInUSD === 0 ?
        AccountLendingPoolPage.Leverage :
        AccountLendingPoolPage.EarnInterest :
      pageSelected;

  const tokenAIconPath = getLendingPoolTokenIconPath(selectedLendingPool, PoolTokenType.BorrowableA);
  const tokenBIconPath = getLendingPoolTokenIconPath(selectedLendingPool, PoolTokenType.BorrowableB);

  const safetyMargin = parseFloat(selectedLendingPool[PoolTokenType.Collateral].safetyMargin);
  const liquidationIncentive = parseFloat(selectedLendingPool[PoolTokenType.Collateral].liquidationIncentive);

  const price = priceObj[0];
  const tokenADecimals = parseInt(selectedLendingPool[PoolTokenType.BorrowableA].underlying.decimals);
  const tokenBDecimals = parseInt(selectedLendingPool[PoolTokenType.BorrowableB].underlying.decimals);
  // ray test touch <<
  // this.priceInverted ? 1 / twapPrice : twapPrice
  const twapPrice = price / 2 ** 112 * Math.pow(10, tokenADecimals) / Math.pow(10, tokenBDecimals);
  // ray test touch >>

  // ray test touch <
  // TODO: should double-check with pancake swap utilities
  const tokenADenomLPPrice = priceDenomLP[0] / 1e18 / 1e18 * Math.pow(10, tokenADecimals);
  const tokenBDenomLPPrice = priceDenomLP[1] / 1e18 / 1e18 * Math.pow(10, tokenBDecimals);
  // ray test touch >

  const reserve0 = parseFloat(formatUnits(reserves[0], tokenADecimals));
  const reserve1 = parseFloat(formatUnits(reserves[1], tokenADecimals));
  // TODO: 18 is hardcoded for `PoolTokenType.Collateral`
  const totalSupply = parseFloat(formatUnits(bigTotalSupply, 18));
  const tokenAMarketDenomLPPrice = totalSupply / reserve0 / 2;
  const tokenBMarketDenomLPPrice = totalSupply / reserve1 / 2;

  // ray test touch <<
  // this.priceInverted ? 1 / marketPrice : marketPrice
  const marketPrice = 1 * reserve1 / reserve0;
  // ray test touch >>

  const availableCashA = parseFloat(selectedLendingPool[PoolTokenType.BorrowableA].totalBalance);
  const availableCashB = parseFloat(selectedLendingPool[PoolTokenType.BorrowableB].totalBalance);
  const availableCashCollateral = parseFloat(selectedLendingPool[PoolTokenType.Collateral].totalBalance);

  const tokenAMaxWithdrawable = Math.min(tokenADeposited, availableCashA) / DUST;
  const tokenBMaxWithdrawable = Math.min(tokenBDeposited, availableCashB) / DUST;
  const {
    valueCollateral,
    valueA,
    valueB
  } = getValuesFromPrice(
    collateralDeposited,
    tokenADenomLPPrice,
    tokenBDenomLPPrice,
    tokenABorrowed,
    tokenBBorrowed
  );
  const safetyMarginWithUIMargin = safetyMargin * UI_MARGIN;
  const actualCollateral = valueCollateral / liquidationIncentive;
  const maxWithdrawable1 =
    // eslint-disable-next-line max-len
    (actualCollateral - (valueA + valueB * safetyMarginWithUIMargin) / Math.sqrt(safetyMarginWithUIMargin)) * liquidationIncentive;
  const maxWithdrawable2 =
    // eslint-disable-next-line max-len
    (actualCollateral - (valueB + valueA * safetyMarginWithUIMargin) / Math.sqrt(safetyMarginWithUIMargin)) * liquidationIncentive;
  const collateralMaxWithdrawable =
    Math.max(0, Math.min(collateralDeposited, availableCashCollateral, maxWithdrawable1, maxWithdrawable2) / DUST);

  const tokenAValueBorrowed = valueA;
  const tokenAValueOther = valueB;
  const tokenATotalValueBorrowable1 =
    (actualCollateral * Math.sqrt(safetyMarginWithUIMargin) - tokenAValueOther) / safetyMarginWithUIMargin;
  const tokenATotalValueBorrowable2 =
    (actualCollateral / Math.sqrt(safetyMarginWithUIMargin) - tokenAValueOther) * safetyMarginWithUIMargin;
  const tokenAMaxValueBorrowable =
    Math.min(tokenATotalValueBorrowable1, tokenATotalValueBorrowable2) - tokenAValueBorrowed;
  const tokenAMaxBorrowable = Math.max(0, Math.min(availableCashA, tokenAMaxValueBorrowable / tokenADenomLPPrice));
  const tokenBValueBorrowed = valueB;
  const tokenBValueOther = valueA;
  const tokenBTotalValueBorrowable1 =
    (actualCollateral * Math.sqrt(safetyMarginWithUIMargin) - tokenBValueOther) / safetyMarginWithUIMargin;
  const tokenBTotalValueBorrowable2 =
    (actualCollateral / Math.sqrt(safetyMarginWithUIMargin) - tokenBValueOther) * safetyMarginWithUIMargin;
  const tokenBMaxValueBorrowable =
    Math.min(tokenBTotalValueBorrowable1, tokenBTotalValueBorrowable2) - tokenBValueBorrowed;
  const tokenBMaxBorrowable = Math.max(0, Math.min(availableCashB, tokenBMaxValueBorrowable / tokenBDenomLPPrice));

  const farmingSharesA = farmingPoolARecipients[0];
  const farmingSharesB = farmingPoolBRecipients[0];

  const farmingPoolTotalAmount = farmingPoolATotalAmount.add(farmingPoolBTotalAmount);

  const hasFarming =
    (farmingPoolAAddress !== undefined && farmingPoolAAddress !== AddressZero) ||
    (farmingPoolBAddress !== undefined && farmingPoolBAddress !== AddressZero);

  const claimLogs = claimALogs.concat(claimBLogs);
  claimLogs.sort((a: Log, b: Log) => b.blockNumber - a.blockNumber); // Order from newest to oldest
  const iface = new Interface(FarmingPoolJSON.abi);
  const claimHistory = claimLogs.map(claimLog => {
    const logData = iface.parseLog(claimLog);

    return {
      amount: parseFloat(formatUnits(logData.args.amount)),
      transactionHash: claimLog.transactionHash
    };
  });

  return (
    <AccountLendingPoolContainer>
      <AccountLendingPoolPageSelector
        pageSelected={actualPageSelected}
        setPageSelected={setPageSelected}
        hasFarming={hasFarming} />
      {actualPageSelected === AccountLendingPoolPage.Leverage && (
        <>
          <AccountLendingPoolDetailsLeverage
            collateralDepositedInUSD={collateralDepositedInUSD}
            debtInUSD={debtInUSD}
            lpEquityInUSD={lpEquityInUSD}
            safetyMargin={safetyMargin}
            liquidationIncentive={liquidationIncentive}
            twapPrice={twapPrice}
            collateralDeposited={collateralDeposited}
            tokenADenomLPPrice={tokenADenomLPPrice}
            tokenBDenomLPPrice={tokenBDenomLPPrice}
            tokenABorrowed={tokenABorrowed}
            tokenBBorrowed={tokenBBorrowed}
            marketPrice={marketPrice}
            tokenASymbol={tokenASymbol}
            tokenBSymbol={tokenBSymbol} />
          {/* ray test touch << */}
          <PoolTokenContext.Provider value={PoolTokenType.Collateral}>
            {/* ray test touch >> */}
            <AccountLendingPoolLPRow
              collateralDepositedInUSD={collateralDepositedInUSD}
              collateralSymbol={collateralSymbol}
              tokenAIconPath={tokenAIconPath}
              tokenBIconPath={tokenBIconPath}
              safetyMargin={safetyMargin}
              liquidationIncentive={liquidationIncentive}
              twapPrice={twapPrice}
              collateralDeposited={collateralDeposited}
              tokenADenomLPPrice={tokenADenomLPPrice}
              tokenBDenomLPPrice={tokenBDenomLPPrice}
              tokenABorrowed={tokenABorrowed}
              tokenBBorrowed={tokenBBorrowed}
              tokenAMarketDenomLPPrice={tokenAMarketDenomLPPrice}
              tokenBMarketDenomLPPrice={tokenBMarketDenomLPPrice}
              marketPrice={marketPrice}
              availableCashA={availableCashA}
              availableCashB={availableCashB}
              maxWithdrawable={collateralMaxWithdrawable}
              tokenASymbol={tokenASymbol}
              tokenBSymbol={tokenBSymbol} />
          </PoolTokenContext.Provider>
          <PoolTokenContext.Provider value={PoolTokenType.BorrowableA}>
            <AccountLendingPoolBorrowRow
              collateralDepositedInUSD={collateralDepositedInUSD}
              tokenBorrowedInUSD={tokenABorrowedInUSD}
              tokenBorrowed={tokenABorrowed}
              tokenSymbol={tokenASymbol}
              collateralSymbol={collateralSymbol}
              tokenIconPath={tokenAIconPath}
              safetyMargin={safetyMargin}
              liquidationIncentive={liquidationIncentive}
              twapPrice={twapPrice}
              collateralDeposited={collateralDeposited}
              tokenADenomLPPrice={tokenADenomLPPrice}
              tokenBDenomLPPrice={tokenBDenomLPPrice}
              tokenABorrowed={tokenABorrowed}
              tokenBBorrowed={tokenBBorrowed}
              marketPrice={marketPrice}
              maxBorrowable={tokenAMaxBorrowable}
              tokenASymbol={tokenASymbol}
              tokenBSymbol={tokenBSymbol} />
          </PoolTokenContext.Provider>
          <PoolTokenContext.Provider value={PoolTokenType.BorrowableB}>
            <AccountLendingPoolBorrowRow
              collateralDepositedInUSD={collateralDepositedInUSD}
              tokenBorrowedInUSD={tokenBBorrowedInUSD}
              tokenBorrowed={tokenBBorrowed}
              tokenSymbol={tokenBSymbol}
              collateralSymbol={collateralSymbol}
              tokenIconPath={tokenBIconPath}
              safetyMargin={safetyMargin}
              liquidationIncentive={liquidationIncentive}
              twapPrice={twapPrice}
              collateralDeposited={collateralDeposited}
              tokenADenomLPPrice={tokenADenomLPPrice}
              tokenBDenomLPPrice={tokenBDenomLPPrice}
              tokenABorrowed={tokenABorrowed}
              tokenBBorrowed={tokenBBorrowed}
              marketPrice={marketPrice}
              maxBorrowable={tokenBMaxBorrowable}
              tokenASymbol={tokenASymbol}
              tokenBSymbol={tokenBSymbol} />
          </PoolTokenContext.Provider>
        </>
      )}
      {actualPageSelected === AccountLendingPoolPage.EarnInterest && (
        <>
          <AccountLendingPoolDetailsEarnInterest
            supplyBalanceInUSD={supplyBalanceInUSD}
            accountAPY={accountAPY} />
          <PoolTokenContext.Provider value={PoolTokenType.BorrowableA}>
            <AccountLendingPoolSupplyRow
              collateralDepositedInUSD={collateralDepositedInUSD}
              tokenSymbol={tokenASymbol}
              tokenIconPath={tokenAIconPath}
              safetyMargin={safetyMargin}
              liquidationIncentive={liquidationIncentive}
              twapPrice={twapPrice}
              collateralDeposited={collateralDeposited}
              tokenADenomLPPrice={tokenADenomLPPrice}
              tokenBDenomLPPrice={tokenBDenomLPPrice}
              tokenABorrowed={tokenABorrowed}
              tokenBBorrowed={tokenBBorrowed}
              marketPrice={marketPrice}
              maxWithdrawable={tokenAMaxWithdrawable}
              tokenASymbol={tokenASymbol}
              tokenBSymbol={tokenBSymbol} />
          </PoolTokenContext.Provider>
          <PoolTokenContext.Provider value={PoolTokenType.BorrowableB}>
            <AccountLendingPoolSupplyRow
              collateralDepositedInUSD={collateralDepositedInUSD}
              tokenSymbol={tokenBSymbol}
              tokenIconPath={tokenBIconPath}
              safetyMargin={safetyMargin}
              liquidationIncentive={liquidationIncentive}
              twapPrice={twapPrice}
              collateralDeposited={collateralDeposited}
              tokenADenomLPPrice={tokenADenomLPPrice}
              tokenBDenomLPPrice={tokenBDenomLPPrice}
              tokenABorrowed={tokenABorrowed}
              tokenBBorrowed={tokenBBorrowed}
              marketPrice={marketPrice}
              maxWithdrawable={tokenBMaxWithdrawable}
              tokenASymbol={tokenASymbol}
              tokenBSymbol={tokenBSymbol} />
          </PoolTokenContext.Provider>
        </>
      )}
      {actualPageSelected === AccountLendingPoolPage.Farming && (
        <>
          <AccountLendingPoolFarming
            tokenABorrowedInUSD={tokenABorrowedInUSD}
            tokenBBorrowedInUSD={tokenBBorrowedInUSD}
            collateralSymbol={collateralSymbol}
            farmingSharesA={farmingSharesA}
            farmingSharesB={farmingSharesB}
            availableReward={farmingPoolTotalAmount}
            claimHistory={claimHistory} />
        </>
      )}
    </AccountLendingPoolContainer>
  );
};

export enum AccountLendingPoolPage {
  Uninitialized,
  Leverage,
  EarnInterest,
  Farming
}

export default withErrorBoundary(AccountLendingPool, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
