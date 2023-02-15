
import { formatFloat } from 'utils/format';

const LIQ_K = 1.7;

interface LiquidationPriceProps {
  liquidationPrice: number;
  TWAPPrice: number;
  safetyMargin: number;
}

const LiquidationPrice = ({
  liquidationPrice,
  TWAPPrice,
  safetyMargin
} : LiquidationPriceProps) => {
  const safetyFactor =
    liquidationPrice > TWAPPrice ?
      liquidationPrice / TWAPPrice - 1 :
      TWAPPrice / liquidationPrice - 1;
  const riskFactor = safetyMargin - 1;
  const riskClass =
    safetyFactor > riskFactor * LIQ_K ** 2 ? 'text-impermaxEmerald' :
      safetyFactor > riskFactor * LIQ_K ** 1 ? 'text-impermaxInchWorm' :
        safetyFactor > riskFactor * LIQ_K ** 0 ? 'text-impermaxGoldTips' :
          safetyFactor > riskFactor * LIQ_K ** -1 ? 'text-impermaxTreePoppy' :
            safetyFactor > riskFactor * LIQ_K ** -2 ? 'text-impermaxTrinidad' :
              'text-impermaxMilanoRed';

  return (
    <span className={riskClass}>
      {formatFloat(liquidationPrice, 4)}
    </span>
  );
};

interface Props {
  safetyMargin: number;
  twapPrice: number;
  liquidationPrices: [
    number,
    number
  ];
}

/**
 * Generates lending pool aggregate details.
 */

const LiquidationPrices = ({
  safetyMargin,
  twapPrice,
  liquidationPrices
} : Props): JSX.Element => {
  const price0 = liquidationPrices[0];
  const price1 = liquidationPrices[1];

  if (!price0 && !price1) {
    return <span>-</span>;
  }
  if (price0 >= twapPrice || price1 <= twapPrice) {
    return (
      <span className='text-impermaxMilanoRed'>
        Liquidatable
      </span>
    );
  }

  return (
    <div className='space-x-1'>
      <LiquidationPrice
        liquidationPrice={price0}
        TWAPPrice={twapPrice}
        safetyMargin={safetyMargin} />
      <span>-</span>
      <LiquidationPrice
        liquidationPrice={price1}
        TWAPPrice={twapPrice}
        safetyMargin={safetyMargin} />
    </div>
  );
};

export default LiquidationPrices;
