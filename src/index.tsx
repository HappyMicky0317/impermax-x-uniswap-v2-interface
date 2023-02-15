
import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { Provider } from 'react-redux';
import {
  QueryClientProvider,
  QueryClient
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import App from './App';
import StakingApp from './StakingApp';
import { IS_STAKING_APP } from 'config/general';
import getLibrary from 'utils/helpers/web3/get-library';
import reportWebVitals from './reportWebVitals';
import store from './store';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            {IS_STAKING_APP ? (
              <StakingApp />
            ) : (
              <App />
            )}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </Provider>
      </Router>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
