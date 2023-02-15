// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import {
  useEffect,
  useState
} from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  Card,
  Row,
  Col
} from 'react-bootstrap';
import { CheckIcon } from '@heroicons/react/outline';

import MainContainer from 'parts/MainContainer';
import InteractionButton, { ButtonState } from 'components/InteractionButton';
import {
  useIsValidPair,
  useIsPairInitialized,
  useIsPoolTokenCreated,
  usePairSymbols
} from 'hooks/useData';
import useCreateNewPair, { CreatePairStep } from 'hooks/useCreateNewPair';
import { PoolTokenType } from 'types/interfaces';
import './create-new-pair.scss';

const CreateNewPair = (): JSX.Element | null => {
  const [stepSelected, setStepSelected] = useState<number>(1);
  const [updater, setUpdater] = useState<number>(0);
  const [uniswapV2PairAddress, setUniswapV2PairAddress] = useState<string>();

  const inputAddressState = useIsValidPair(uniswapV2PairAddress);
  const isBorrowable0Created = useIsPoolTokenCreated(uniswapV2PairAddress, PoolTokenType.BorrowableA, updater);
  const isBorrowable1Created = useIsPoolTokenCreated(uniswapV2PairAddress, PoolTokenType.BorrowableB, updater);
  const isCollateralCreated = useIsPoolTokenCreated(uniswapV2PairAddress, PoolTokenType.Collateral, updater);
  const isPairInitialized = useIsPairInitialized(uniswapV2PairAddress, updater);
  const { symbol0, symbol1 } = usePairSymbols(uniswapV2PairAddress);

  useEffect(() => {
    if (stepSelected === 2 && isBorrowable0Created) setStepSelected(3);
    if (stepSelected === 3 && isBorrowable1Created) setStepSelected(4);
    if (stepSelected === 4 && isCollateralCreated) setStepSelected(5);
    if (stepSelected === 5 && isPairInitialized) setStepSelected(6);
  }, [stepSelected, isBorrowable0Created, isBorrowable1Created, isCollateralCreated, isPairInitialized]);

  const update = () => setUpdater(updater + 1);

  const [createBorrowable0State, createBorrowable0] = useCreateNewPair(uniswapV2PairAddress, CreatePairStep.BORROWABLE0);
  const [createBorrowable1State, createBorrowable1] = useCreateNewPair(uniswapV2PairAddress, CreatePairStep.BORROWABLE1);
  const [createCollateralState, createCollateral] = useCreateNewPair(uniswapV2PairAddress, CreatePairStep.COLLATERAL);
  const [initializeState, initialize] = useCreateNewPair(uniswapV2PairAddress, CreatePairStep.INITIALIZE);

  useEffect(() => {
    update();
  }, [createBorrowable0State, createBorrowable1State, createCollateralState, initializeState]);

  const stepClassName = (n: number) => stepSelected === n ? 'step selected' : stepSelected > n ? 'step done' : 'step todo';

  const { account } = useWeb3React<Web3Provider>();

  if (!account) return null;

  return (
    <MainContainer>
      <Card className='mt-4 p-4'>
        <Row className='steps'>
          <Col className={stepClassName(1)}>
            <i className='step-number'>
              {stepSelected > 1 ? (
                <CheckIcon
                  className={clsx(
                    'w-6',
                    'h-6'
                  )} />
              ) : (
                <>1</>
              )}
            </i> Insert pair address
          </Col>
          <Col className={stepClassName(2)}>
            <i className='step-number'>
              {stepSelected > 2 ? (
                <CheckIcon
                  className={clsx(
                    'w-6',
                    'h-6'
                  )} />
              ) : (
                <>2</>
              )}
            </i> First deploy
          </Col>
          <Col className={stepClassName(3)}>
            <i className='step-number'>
              {stepSelected > 3 ? (
                <CheckIcon
                  className={clsx(
                    'w-6',
                    'h-6'
                  )} />
              ) : (
                <>3</>
              )}
            </i> Second deploy
          </Col>
          <Col className={stepClassName(4)}>
            <i className='step-number'>
              {stepSelected > 4 ? (
                <CheckIcon
                  className={clsx(
                    'w-6',
                    'h-6'
                  )} />
              ) : (
                <>4</>
              )}
            </i> Third deploy
          </Col>
          <Col className={stepClassName(5)}>
            <i className='step-number'>
              {stepSelected > 5 ? (
                <CheckIcon
                  className={clsx(
                    'w-6',
                    'h-6'
                  )} />
              ) : (
                <>5</>
              )}
            </i> Initialize pair
          </Col>
        </Row>
        {stepSelected === 1 && (
          <div className='form-group'>
            <label htmlFor='pairAddress'>Insert UniswapV2 pair address:</label>
            <input
              id='pairAddress'
              className='form-control'
              type='text'
              onChange={event => setUniswapV2PairAddress(event.target.value)}
              autoComplete='off' />
            {inputAddressState === InputAddressState.INVALID_ADDRESS && uniswapV2PairAddress && (
              <small className='input-address-state invalid'>Plase insert a valid address</small>
            )}
            {inputAddressState === InputAddressState.INVALID_PAIR && uniswapV2PairAddress && (
              <small className='input-address-state invalid'>Invalid UniswapV2 pair</small>
            )}
            <div className='submit-container'>
              <InteractionButton
                name={inputAddressState === InputAddressState.VALID ? `Create ${symbol0}-${symbol1}` : `Insert valid address`}
                onCall={() => setStepSelected(2)}
                state={inputAddressState === InputAddressState.VALID ? ButtonState.Ready : ButtonState.Disabled} />
            </div>
          </div>
        )}
        {stepSelected === 2 && (
          <div className='submit-container'>
            <InteractionButton
              name={`Create ${symbol0} pool`}
              onCall={createBorrowable0}
              state={createBorrowable0State} />
          </div>
        )}
        {stepSelected === 3 && (
          <div className='submit-container'>
            <InteractionButton
              name={`Create ${symbol1} pool`}
              onCall={createBorrowable1}
              state={createBorrowable1State} />
          </div>
        )}
        {stepSelected === 4 && (
          <div className='submit-container'>
            <InteractionButton
              name='Create collateral pool'
              onCall={createCollateral}
              state={createCollateralState} />
          </div>
        )}
        {stepSelected === 5 && (
          <div className='submit-container'>
            <InteractionButton
              name={`Initialize ${symbol0}-${symbol1}`}
              onCall={initialize}
              state={initializeState} />
          </div>
        )}
        {stepSelected === 6 && (
          <div className='submit-container'>
            The {symbol0}-{symbol1} lending pool has been successfully created.<br />
            <a href={'/lending-pool/' + uniswapV2PairAddress}>Open the lending pool page now</a>
          </div>
        )}
      </Card>
    </MainContainer>
  );
};

export enum InputAddressState {
  INVALID_ADDRESS,
  INVALID_PAIR,
  LOADING,
  VALID
}

export default CreateNewPair;
