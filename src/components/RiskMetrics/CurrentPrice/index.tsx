
// import { RefreshIcon } from '@heroicons/react/outline';
// import clsx from 'clsx';

import { DetailListItem } from 'components/DetailList';
import {
  // ray test touch <<
  // useTogglePriceInverted,
  // ray test touch >>
  usePriceInverted
} from 'hooks/useImpermaxRouter';
import { formatFloat } from 'utils/format';

/**
 * Generates lending pool aggregate details.
 */

interface Props {
  twapPrice: number;
  marketPrice: number;
  tokenASymbol: string;
  tokenBSymbol: string;
}

const CurrentPrice = ({
  twapPrice,
  marketPrice,
  tokenASymbol,
  tokenBSymbol
}: Props): JSX.Element => {
  const priceInverted = usePriceInverted();
  // ray test touch <<
  // const togglePriceInverted = useTogglePriceInverted();
  // ray test touch >>
  const pair =
    priceInverted ?
      `${tokenBSymbol}/${tokenASymbol}` :
      `${tokenASymbol}/${tokenBSymbol}`;

  return (
    <DetailListItem
      title={`TWAP Price (${pair})`}
      tooltip='The TWAP (Time Weighted Average Price) and the current market price on Uniswap.'>
      <span>{formatFloat(twapPrice, 4)}</span>
      <span>(current: {formatFloat(marketPrice, 4)})</span>
      {/* ray test touch << */}
      {/* <RefreshIcon
        className={clsx(
          'w-6',
          'h-6',
          'cursor-pointer'
        )}
        onClick={() => togglePriceInverted()} /> */}
      {/* ray test touch >> */}
    </DetailListItem>
  );
};

export default CurrentPrice;
