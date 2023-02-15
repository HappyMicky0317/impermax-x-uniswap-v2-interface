
import clsx from 'clsx';
import { ArrowRightIcon } from '@heroicons/react/outline';

import LiquidationPrices from './LiquidationPrices';
import CurrentPrice from './CurrentPrice';
import DetailList, { DetailListItem } from 'components/DetailList';
import { formatLeverage } from 'utils/format';
import { Changes } from 'types/interfaces';

const checkValidChanges = (changes: Changes) => {
  return (
    changes.changeCollateral ||
    changes.changeBorrowedA ||
    changes.changeBorrowedB
  );
};

interface Props {
  hideIfNull?: boolean;
  safetyMargin: number;
  twapPrice: number;
  changes: Changes;
  currentLeverage: number;
  newLeverage: number;
  currentLiquidationPrices: [
    number,
    number
  ];
  newLiquidationPrices: [
    number,
    number
  ];
  marketPrice: number;
  tokenASymbol: string;
  tokenBSymbol: string;
}

/**
 * Generates lending pool aggregate details.
 */

const RiskMetrics = ({
  hideIfNull,
  safetyMargin,
  twapPrice,
  changes,
  currentLeverage,
  newLeverage,
  currentLiquidationPrices,
  newLiquidationPrices,
  marketPrice,
  tokenASymbol,
  tokenBSymbol
} : Props): JSX.Element | null => {
  const validChanges = checkValidChanges(changes);

  if (hideIfNull && currentLeverage === 1) return null;

  const leverageTooltip = 'Calculated as: Total Collateral / LP Equity';
  const liquidationTooltip = 'If the price crosses these boundaries, your account will become liquidatable.';

  return (
    <DetailList>
      {validChanges ? (
        <DetailListItem
          title='New Leverage'
          tooltip={leverageTooltip}>
          <span>{formatLeverage(currentLeverage)}</span>
          <ArrowRightIcon
            className={clsx(
              'w-6',
              'h-6'
            )} />
          <span>{formatLeverage(newLeverage)}</span>
        </DetailListItem>
      ) : (
        <DetailListItem
          title='Current Leverage'
          tooltip={leverageTooltip}>
          <span>{formatLeverage(currentLeverage)}</span>
        </DetailListItem>
      )}
      {validChanges ? (
        <DetailListItem
          title='New Liquidation Prices'
          tooltip={liquidationTooltip}>
          <LiquidationPrices
            safetyMargin={safetyMargin}
            twapPrice={twapPrice}
            liquidationPrices={currentLiquidationPrices} />
          <ArrowRightIcon
            className={clsx(
              'w-6',
              'h-6'
            )} />
          <LiquidationPrices
            safetyMargin={safetyMargin}
            twapPrice={twapPrice}
            liquidationPrices={newLiquidationPrices} />
        </DetailListItem>
      ) : (
        <DetailListItem
          title='Liquidation Prices'
          tooltip={liquidationTooltip}>
          <LiquidationPrices
            safetyMargin={safetyMargin}
            twapPrice={twapPrice}
            liquidationPrices={currentLiquidationPrices} />
        </DetailListItem>
      )}
      <CurrentPrice
        twapPrice={twapPrice}
        marketPrice={marketPrice}
        tokenASymbol={tokenASymbol}
        tokenBSymbol={tokenBSymbol} />
    </DetailList>
  );
};

export default RiskMetrics;
