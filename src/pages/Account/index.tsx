
import { useParams } from 'react-router-dom';

import AccountContent from './AccountContent';
import MainContainer from 'parts/MainContainer';
import { AccountContext } from 'contexts/AccountProvider';
import { PARAMETERS } from 'utils/constants/links';

const Account = (): JSX.Element => {
  const { [PARAMETERS.ACCOUNT]: account } = useParams<Record<string, string>>();

  return (
    <MainContainer>
      <AccountContext.Provider value={account}>
        <AccountContent />
      </AccountContext.Provider>
    </MainContainer>
  );
};

export default Account;
