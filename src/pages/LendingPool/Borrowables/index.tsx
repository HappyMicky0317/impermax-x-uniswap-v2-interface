
import { useParams } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import clsx from 'clsx';

import Borrowable from './Borrowable';
import ErrorFallback from 'components/ErrorFallback';
import { IMX_ADDRESSES } from 'config/web3/contracts/imxes';
import { W_ETH_ADDRESSES } from 'config/web3/contracts/w-eths';
import { UNISWAP_V2_FACTORY_ADDRESSES } from 'config/web3/contracts/uniswap-v2-factories';
import toAPY from 'utils/helpers/to-apy';
import getPairAddress from 'utils/helpers/web3/get-pair-address';
import {
  formatNumberWithUSDCommaDecimals,
  formatNumberWithPercentageCommaDecimals
} from 'utils/helpers/format-number';
import {
  getLendingPoolTokenName,
  getLendingPoolTokenSymbol,
  getLendingPoolTokenTotalSupplyInUSD,
  getLendingPoolTokenTotalBorrowInUSD,
  getLendingPoolTokenUtilizationRate,
  getLendingPoolTokenSupplyAPY,
  getLendingPoolTokenBorrowAPY,
  getLendingPoolTokenIconPath,
  getLendingPoolTokenPriceInUSD
} from 'utils/helpers/lending-pools';
import { PARAMETERS } from 'utils/constants/links';
import useLendingPool from 'services/hooks/use-lending-pool';
import useFarmingPoolAddresses from 'services/hooks/use-farming-pool-addresses';
import {
  PoolTokenType,
  LendingPoolData
} from 'types/interfaces';

const getIMXPrice = (
  chainID: number,
  imxLendingPool: LendingPoolData
) => {
  const imxAddress = IMX_ADDRESSES[chainID];
  const aAddress = imxLendingPool[PoolTokenType.BorrowableA].underlying.id;
  const poolTokenType =
    aAddress.toLowerCase() === imxAddress.toLowerCase() ?
      PoolTokenType.BorrowableA :
      PoolTokenType.BorrowableB;

  return getLendingPoolTokenPriceInUSD(imxLendingPool, poolTokenType);
};

const getRewardSpeed = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
) => {
  const farmingPool = lendingPool[poolTokenType].farmingPool;
  if (farmingPool === null) {
    return 0;
  }
  const segmentLength = parseInt(farmingPool.segmentLength);
  const epochBegin = parseInt(farmingPool.epochBegin);
  const epochAmount = parseFloat(farmingPool.epochAmount);
  const epochEnd = epochBegin + segmentLength;
  const timestamp = new Date().getTime() / 1000;
  if (timestamp > epochEnd) {
    // How to manage better this case? Maybe check shares on distributor
    return 0;
  }
  return epochAmount / segmentLength;
};

const Borrowables = (): JSX.Element => {
  const {
    [PARAMETERS.CHAIN_ID]: selectedChainIDParam,
    [PARAMETERS.UNISWAP_V2_PAIR_ADDRESS]: selectedUniswapV2PairAddress
  } = useParams<Record<string, string>>();
  const selectedChainID = Number(selectedChainIDParam);

  const { library } = useWeb3React<Web3Provider>();
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
    isLoading: selectedLendingPoolLoading,
    data: selectedLendingPool,
    error: selectedLendingPoolError
  } = useLendingPool(selectedUniswapV2PairAddress, selectedChainID);
  useErrorHandler(selectedLendingPoolError);

  const imxAddress = IMX_ADDRESSES[selectedChainID];
  const wETHAddress = W_ETH_ADDRESSES[selectedChainID];
  const uniswapV2FactoryAddress = UNISWAP_V2_FACTORY_ADDRESSES[selectedChainID];
  const imxPairAddress = getPairAddress(wETHAddress, imxAddress, uniswapV2FactoryAddress);
  const {
    isLoading: imxLendingPoolLoading,
    data: imxLendingPool,
    error: imxLendingPoolError
  } = useLendingPool(imxPairAddress, selectedChainID);
  useErrorHandler(imxLendingPoolError);

  // TODO: should use skeleton loaders
  if (selectedLendingPoolLoading) {
    return <>Loading...</>;
  }
  if (imxLendingPoolLoading) {
    return <>Loading...</>;
  }
  if (farmingPoolAddressesLoading) {
    return <>Loading...</>;
  }
  if (imxLendingPool === undefined) {
    throw new Error('Something went wrong!');
  }
  if (selectedLendingPool === undefined) {
    throw new Error('Something went wrong!');
  }

  const imxPrice = getIMXPrice(selectedChainID, imxLendingPool);

  const renderBorrowable = (poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB) => {
    const tokenName = getLendingPoolTokenName(selectedLendingPool, poolTokenType, selectedChainID);
    const tokenSymbol = getLendingPoolTokenSymbol(selectedLendingPool, poolTokenType, selectedChainID);
    const tokenTotalSupplyInUSD = getLendingPoolTokenTotalSupplyInUSD(selectedLendingPool, poolTokenType);
    const tokenTotalBorrowInUSD = getLendingPoolTokenTotalBorrowInUSD(selectedLendingPool, poolTokenType);
    const tokenUtilizationRate = getLendingPoolTokenUtilizationRate(selectedLendingPool, poolTokenType);
    const tokenSupplyAPY = getLendingPoolTokenSupplyAPY(selectedLendingPool, poolTokenType);
    const tokenBorrowAPY = getLendingPoolTokenBorrowAPY(selectedLendingPool, poolTokenType);
    const tokenIcon = getLendingPoolTokenIconPath(selectedLendingPool, poolTokenType);

    const rewardSpeed = getRewardSpeed(selectedLendingPool, poolTokenType);
    let farmingAPY;
    if (tokenTotalBorrowInUSD === 0) {
      farmingAPY = 0;
    } else {
      farmingAPY = toAPY(imxPrice * rewardSpeed / tokenTotalBorrowInUSD);
    }

    const items = [
      {
        name: 'Total Supply',
        value: formatNumberWithUSDCommaDecimals(tokenTotalSupplyInUSD)
      },
      {
        name: 'Total Borrow',
        value: formatNumberWithUSDCommaDecimals(tokenTotalBorrowInUSD)
      },
      {
        name: 'Utilization Rate',
        value: formatNumberWithPercentageCommaDecimals(tokenUtilizationRate)
      },
      {
        name: 'Supply APY',
        value: formatNumberWithPercentageCommaDecimals(tokenSupplyAPY)
      },
      {
        name: 'Borrow APY',
        value: formatNumberWithPercentageCommaDecimals(tokenBorrowAPY)
      }
    ];
    if (
      (poolTokenType === PoolTokenType.BorrowableA && farmingPoolAAddress) ||
      (poolTokenType === PoolTokenType.BorrowableB && farmingPoolBAddress)
    ) {
      items.push({
        name: 'Farming APY',
        value: formatNumberWithPercentageCommaDecimals(farmingAPY)
      });
    }

    return (
      <Borrowable
        tokenIcon={tokenIcon}
        tokenName={tokenName}
        tokenSymbol={tokenSymbol}
        items={items} />
    );
  };

  return (
    <div
      className={clsx(
        'space-y-3',
        'md:space-y-0',
        'md:grid',
        'md:grid-cols-2',
        'md:gap-3'
      )}>
      {renderBorrowable(PoolTokenType.BorrowableA)}
      {renderBorrowable(PoolTokenType.BorrowableB)}
    </div>
  );
};

export default withErrorBoundary(Borrowables, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
