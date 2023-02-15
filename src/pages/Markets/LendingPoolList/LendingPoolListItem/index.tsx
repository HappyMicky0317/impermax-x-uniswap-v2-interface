
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import LendingPoolListItemDesktopGridWrapper from './LendingPoolListItemDesktopGridWrapper';
import LendingPoolListItemMobileGridWrapper from './LendingPoolListItemMobileGridWrapper';
import TokenPairLabel from './TokenPairLabel';
import TokenLabel from './TokenLabel';
import PropertyLabel from './PropertyLabel';
import Value from './Value';
import PairWrapper from './PairWrapper';
import Panel from 'components/Panel';
import { IMX_ADDRESSES } from 'config/web3/contracts/imxes';
import toAPY from 'utils/helpers/to-apy';
import {
  formatNumberWithUSDCommaDecimals,
  formatNumberWithPercentageCommaDecimals
} from 'utils/helpers/format-number';
import {
  getLendingPoolTokenSymbol,
  getLendingPoolTokenTotalSupplyInUSD,
  getLendingPoolTokenTotalBorrowInUSD,
  getLendingPoolTokenSupplyAPY,
  getLendingPoolTokenBorrowAPY,
  getLendingPoolTokenIconPath
} from 'utils/helpers/lending-pools';
import {
  PAGES,
  PARAMETERS
} from 'utils/constants/links';
import {
  PoolTokenType,
  LendingPoolData
} from 'types/interfaces';

const LEVERAGE = 5;

interface Props {
  chainID: number;
  imxLendingPool: LendingPoolData;
  lendingPool: LendingPoolData;
  greaterThanMd: boolean;
}

const LendingPoolListItem = ({
  chainID,
  imxLendingPool,
  lendingPool,
  greaterThanMd
}: Props): JSX.Element => {
  const tokenASymbol = getLendingPoolTokenSymbol(lendingPool, PoolTokenType.BorrowableA, chainID);
  const tokenBSymbol = getLendingPoolTokenSymbol(lendingPool, PoolTokenType.BorrowableB, chainID);
  const tokenATotalSupplyInUSD = getLendingPoolTokenTotalSupplyInUSD(lendingPool, PoolTokenType.BorrowableA);
  const tokenBTotalSupplyInUSD = getLendingPoolTokenTotalSupplyInUSD(lendingPool, PoolTokenType.BorrowableB);
  const tokenATotalBorrowInUSD = getLendingPoolTokenTotalBorrowInUSD(lendingPool, PoolTokenType.BorrowableA);
  const tokenBTotalBorrowInUSD = getLendingPoolTokenTotalBorrowInUSD(lendingPool, PoolTokenType.BorrowableB);
  const tokenASupplyAPY = getLendingPoolTokenSupplyAPY(lendingPool, PoolTokenType.BorrowableA);
  const tokenBSupplyAPY = getLendingPoolTokenSupplyAPY(lendingPool, PoolTokenType.BorrowableB);
  const tokenABorrowAPY = getLendingPoolTokenBorrowAPY(lendingPool, PoolTokenType.BorrowableA);
  const tokenBBorrowAPY = getLendingPoolTokenBorrowAPY(lendingPool, PoolTokenType.BorrowableB);

  const imxAddress = IMX_ADDRESSES[chainID];
  const aAddress = imxLendingPool[PoolTokenType.BorrowableA].underlying.id;
  const poolTokenType =
    aAddress.toLowerCase() === imxAddress.toLowerCase() ?
      PoolTokenType.BorrowableA :
      PoolTokenType.BorrowableB;
  const imxPrice = Number(imxLendingPool[poolTokenType].underlying.derivedUSD);
  let rewardSpeed;
  const farmingPoolData = lendingPool[poolTokenType].farmingPool;
  if (farmingPoolData === null) {
    rewardSpeed = 0;
  } else {
    const segmentLength = parseInt(farmingPoolData.segmentLength);
    const epochBegin = parseInt(farmingPoolData.epochBegin);
    const epochAmount = parseFloat(farmingPoolData.epochAmount);
    const epochEnd = epochBegin + segmentLength;
    const timestamp = (new Date()).getTime() / 1000;
    if (timestamp > epochEnd) {
      // How to manage better this case? Maybe check shares on distributor
      rewardSpeed = 0;
    } else {
      rewardSpeed = epochAmount / segmentLength;
    }
  }
  let farmingPoolAPYA;
  if (tokenATotalBorrowInUSD === 0) {
    farmingPoolAPYA = 0;
  } else {
    farmingPoolAPYA = toAPY(imxPrice * rewardSpeed / tokenATotalBorrowInUSD);
  }
  let farmingPoolAPYB;
  if (tokenATotalBorrowInUSD === 0) {
    farmingPoolAPYB = 0;
  } else {
    farmingPoolAPYB = toAPY(imxPrice * rewardSpeed / tokenBTotalBorrowInUSD);
  }

  const lendingPoolURL =
    PAGES.LENDING_POOL
      .replace(`:${PARAMETERS.CHAIN_ID}`, chainID.toString())
      .replace(`:${PARAMETERS.UNISWAP_V2_PAIR_ADDRESS}`, lendingPool.id);

  const uniswapAPY = lendingPool.pair.uniswapAPY;
  const averageAPY = (tokenABorrowAPY + tokenBBorrowAPY - farmingPoolAPYA - farmingPoolAPYB) / 2;
  const leveragedAPY = uniswapAPY * LEVERAGE - averageAPY * (LEVERAGE - 1);
  const tokenIconA = getLendingPoolTokenIconPath(lendingPool, PoolTokenType.BorrowableA);
  const tokenIconB = getLendingPoolTokenIconPath(lendingPool, PoolTokenType.BorrowableB);

  return (
    <Link
      to={lendingPoolURL}
      className='block'>
      <Panel
        className={clsx(
          'bg-white',
          'px-4',
          'py-5',
          'md:p-6',
          'hover:bg-gray-50'
        )}>
        {greaterThanMd ? (
          <LendingPoolListItemDesktopGridWrapper>
            <TokenPairLabel
              className='col-span-2'
              tokenIconA={tokenIconA}
              tokenIconB={tokenIconB}
              symbolA={tokenASymbol}
              symbolB={tokenBSymbol} />
            <PairWrapper>
              <TokenLabel
                tokenIcon={tokenIconA}
                symbol={tokenASymbol} />
              <TokenLabel
                tokenIcon={tokenIconB}
                symbol={tokenBSymbol} />
            </PairWrapper>
            <PairWrapper>
              <Value>{formatNumberWithUSDCommaDecimals(tokenATotalSupplyInUSD)}</Value>
              <Value>{formatNumberWithUSDCommaDecimals(tokenBTotalSupplyInUSD)}</Value>
            </PairWrapper>
            <PairWrapper>
              <Value>{formatNumberWithUSDCommaDecimals(tokenATotalBorrowInUSD)}</Value>
              <Value>{formatNumberWithUSDCommaDecimals(tokenBTotalBorrowInUSD)}</Value>
            </PairWrapper>
            <PairWrapper>
              <Value>{formatNumberWithPercentageCommaDecimals(tokenASupplyAPY)}</Value>
              <Value>{formatNumberWithPercentageCommaDecimals(tokenBSupplyAPY)}</Value>
            </PairWrapper>
            <PairWrapper>
              <Value>{formatNumberWithPercentageCommaDecimals(tokenABorrowAPY)}</Value>
              <Value>{formatNumberWithPercentageCommaDecimals(tokenBBorrowAPY)}</Value>
            </PairWrapper>
            <Value
              className={clsx(
                'self-center',
                'justify-self-center',
                'text-lg',
                'font-medium',
                'text-impermaxAstral'
              )}>
              {formatNumberWithPercentageCommaDecimals(leveragedAPY)}
            </Value>
          </LendingPoolListItemDesktopGridWrapper>
        ) : (
          <>
            <LendingPoolListItemMobileGridWrapper>
              <TokenPairLabel
                tokenIconA={tokenIconA}
                tokenIconB={tokenIconB}
                symbolA={tokenASymbol}
                symbolB={tokenBSymbol} />
              <TokenLabel
                tokenIcon={tokenIconA}
                symbol={tokenASymbol} />
              <TokenLabel
                tokenIcon={tokenIconB}
                symbol={tokenBSymbol} />
            </LendingPoolListItemMobileGridWrapper>
            <LendingPoolListItemMobileGridWrapper
              className={clsx(
                'gap-y-1.5',
                'mt-2.5'
              )}>
              <>
                <PropertyLabel className='self-center'>
                  Total supply
                </PropertyLabel>
                <Value>{formatNumberWithUSDCommaDecimals(tokenATotalSupplyInUSD)}</Value>
                <Value>{formatNumberWithUSDCommaDecimals(tokenBTotalSupplyInUSD)}</Value>
              </>
              <>
                <PropertyLabel className='self-center'>
                  Total borrowed
                </PropertyLabel>
                <Value>{formatNumberWithUSDCommaDecimals(tokenATotalBorrowInUSD)}</Value>
                <Value>{formatNumberWithUSDCommaDecimals(tokenBTotalBorrowInUSD)}</Value>
              </>
              <>
                <PropertyLabel className='self-center'>
                  Supply APY
                </PropertyLabel>
                <Value>{formatNumberWithPercentageCommaDecimals(tokenASupplyAPY)}</Value>
                <Value>{formatNumberWithPercentageCommaDecimals(tokenBSupplyAPY)}</Value>
              </>
              <>
                <PropertyLabel className='self-center'>
                  Borrow APY
                </PropertyLabel>
                <Value>{formatNumberWithPercentageCommaDecimals(tokenABorrowAPY)}</Value>
                <Value>{formatNumberWithPercentageCommaDecimals(tokenBBorrowAPY)}</Value>
              </>
              <>
                <PropertyLabel className='self-center'>
                  Leveraged LP APY
                </PropertyLabel>
                <Value
                  className={clsx(
                    'col-span-2',
                    'justify-self-center',
                    'text-lg',
                    'font-medium',
                    'text-impermaxAstral'
                  )}>
                  {formatNumberWithPercentageCommaDecimals(leveragedAPY)}
                </Value>
              </>
            </LendingPoolListItemMobileGridWrapper>
          </>
        )}
      </Panel>
    </Link>
  );
};

export default LendingPoolListItem;
