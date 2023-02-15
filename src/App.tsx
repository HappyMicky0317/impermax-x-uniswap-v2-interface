
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Layout from 'parts/Layout';
// ray test touch <
// TODO: should do code-splitting
import Markets from 'pages/Markets';
import LendingPool from 'pages/LendingPool';
import Risks from 'pages/Risks';
import Claim from 'pages/Claim';
import CreateNewPair from 'pages/CreateNewPair';
import Account from 'pages/Account';
import NoMatch from 'pages/NoMatch';
// ray test touch >
import ImpermaxRouterProvider from 'contexts/ImpermaxRouterProvider';
import SubgraphProvider from 'contexts/SubgraphProvider';
import Updater from 'store/transactions/updater';
import { SUPPORTED_CHAIN_IDS } from 'config/web3/chains';
import {
  PAGES,
  PARAMETERS
} from 'utils/constants/links';
import './app.scss';

const App = (): JSX.Element | null => {
  // TODO: double-check
  const { chainId } = useWeb3React<Web3Provider>();

  return (
    <Layout>
      <Updater />
      {/* TODO: should fix properly */}
      <Switch>
        <Route path={PAGES.CREATE_NEW_PAIR}>
          {chainId ? (
            <SubgraphProvider key={chainId}>
              <ImpermaxRouterProvider>
                <CreateNewPair />
              </ImpermaxRouterProvider>
            </SubgraphProvider>
          ) : null}
        </Route>
        <Route path={PAGES.LENDING_POOL}>
          {chainId ? (
            <SubgraphProvider key={chainId}>
              <ImpermaxRouterProvider>
                <LendingPool />
              </ImpermaxRouterProvider>
            </SubgraphProvider>
          ) : null}
        </Route>
        <Route path={PAGES.ACCOUNT}>
          {chainId ? (
            <SubgraphProvider key={chainId}>
              <ImpermaxRouterProvider>
                <Account />
              </ImpermaxRouterProvider>
            </SubgraphProvider>
          ) : null}
        </Route>
        <Route path={PAGES.CLAIM}>
          {chainId ? (
            <SubgraphProvider key={chainId}>
              <ImpermaxRouterProvider>
                <Claim />
              </ImpermaxRouterProvider>
            </SubgraphProvider>
          ) : null}
        </Route>
        <Route path={PAGES.RISKS}>
          {chainId ? (
            <SubgraphProvider key={chainId}>
              <ImpermaxRouterProvider>
                <Risks />
              </ImpermaxRouterProvider>
            </SubgraphProvider>
          ) : null}
        </Route>
        <Route
          path={PAGES.USER_GUIDE}
          component={() => {
            // TODO: should use <a /> with security attributes
            window.location.href = 'https://impermax.finance/User-Guide-Impermax.pdf';
            return null;
          }} />
        <Route path={PAGES.MARKETS}>
          <Markets />
        </Route>
        <Redirect
          exact
          from={PAGES.HOME}
          to={PAGES.MARKETS.replace(`:${PARAMETERS.CHAIN_ID}`, SUPPORTED_CHAIN_IDS[0].toString())} />
        <Route path='*'>
          <NoMatch />
        </Route>
      </Switch>
    </Layout>
  );
};

export default App;
