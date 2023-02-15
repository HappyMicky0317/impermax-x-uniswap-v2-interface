
import { useParams } from 'react-router-dom';

import OverallStats from './OverallStats';
import ActionBar from './ActionBar';
import LendingPoolList from './LendingPoolList';
import MainContainer from 'parts/MainContainer';
import { PARAMETERS } from 'utils/constants/links';

const Markets = (): JSX.Element => {
  const { [PARAMETERS.CHAIN_ID]: selectedChainIDParam } = useParams<Record<string, string>>();
  const selectedChainID = Number(selectedChainIDParam);

  return (
    <MainContainer>
      <OverallStats chainID={selectedChainID} />
      <ActionBar />
      <LendingPoolList chainID={selectedChainID} />
    </MainContainer>
  );
};

export default Markets;
