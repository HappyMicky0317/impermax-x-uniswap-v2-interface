
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import Staking from 'pages/Staking';
import { PAGES } from 'utils/constants/links';

const StakingApp = (): JSX.Element => {
  return (
    <Switch>
      <Route
        path={PAGES.STAKING}>
        <Staking />
      </Route>
      <Route path='*'>
        <Redirect to={PAGES.STAKING} />
      </Route>
    </Switch>
  );
};

export default StakingApp;
