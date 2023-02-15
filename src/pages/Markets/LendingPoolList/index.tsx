
import { useMedia } from 'react-use';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';

import LendingPoolListItem from './LendingPoolListItem';
import LendingPoolListHeader from './LendingPoolListHeader';
import ErrorFallback from 'components/ErrorFallback';
import LineLoadingSpinner from 'components/LineLoadingSpinner';
import { W_ETH_ADDRESSES } from 'config/web3/contracts/w-eths';
import { IMX_ADDRESSES } from 'config/web3/contracts/imxes';
import { UNISWAP_V2_FACTORY_ADDRESSES } from 'config/web3/contracts/uniswap-v2-factories';
import getPairAddress from 'utils/helpers/web3/get-pair-address';
import { BREAKPOINTS } from 'utils/constants/styles';
import useLendingPools from 'services/hooks/use-lending-pools';

interface Props {
  chainID: number;
}

const LendingPoolList = ({
  chainID
}: Props): JSX.Element => {
  const greaterThanMd = useMedia(`(min-width: ${BREAKPOINTS.md})`);

  const {
    isLoading: lendingPoolsLoading,
    data: lendingPools,
    error: lendingPoolsError
  } = useLendingPools(chainID);
  useErrorHandler(lendingPoolsError);

  // TODO: should use skeleton loaders
  if (lendingPoolsLoading) {
    return <LineLoadingSpinner />;
  }
  if (lendingPools === undefined) {
    throw new Error('Something went wrong!');
  }

  const imxAddress = IMX_ADDRESSES[chainID];
  const wETHAddress = W_ETH_ADDRESSES[chainID];
  const uniswapV2FactoryAddress = UNISWAP_V2_FACTORY_ADDRESSES[chainID];
  const imxPair = getPairAddress(wETHAddress, imxAddress, uniswapV2FactoryAddress).toLowerCase();
  const imxLendingPool = lendingPools.find(lendingPool => lendingPool.id === imxPair);

  if (!imxLendingPool) {
    throw new Error('Something went wrong!');
  }

  return (
    <div className='space-y-3'>
      {greaterThanMd && (
        <LendingPoolListHeader className='px-4' />
      )}
      {lendingPools.map(lendingPool => {
        return (
          <LendingPoolListItem
            key={lendingPool.id}
            chainID={chainID}
            imxLendingPool={imxLendingPool}
            lendingPool={lendingPool}
            greaterThanMd={greaterThanMd} />
        );
      })}
    </div>
  );
};

export default withErrorBoundary(LendingPoolList, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
