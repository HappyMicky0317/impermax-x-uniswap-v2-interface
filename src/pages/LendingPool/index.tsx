
import { useParams } from 'react-router-dom';

import Borrowables from './Borrowables';
import AccountLendingPool from './AccountLendingPool';

import MainContainer from 'parts/MainContainer';
// ray test touch <
import PairAddressContext from 'contexts/PairAddress';
// ray test touch >
import { PARAMETERS } from 'utils/constants/links';

const LendingPool = (): JSX.Element => {
  const { [PARAMETERS.UNISWAP_V2_PAIR_ADDRESS]: selectedUniswapV2PairAddress } = useParams<Record<string, string>>();

  return (
    <MainContainer>
      <Borrowables />
      <PairAddressContext.Provider value={selectedUniswapV2PairAddress}>
        <AccountLendingPool />
      </PairAddressContext.Provider>
    </MainContainer>
  );
};

export default LendingPool;
