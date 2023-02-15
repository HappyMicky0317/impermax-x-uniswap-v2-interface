import { useState, useEffect } from 'react';
import { InteractionModalContainer } from '.';
import { Row, Col } from 'react-bootstrap';
import { PoolTokenType, ApprovalType } from '../../types/interfaces';
import RiskMetrics from '../RiskMetrics';
import { formatFloat, formatPercentage } from '../../utils/format';
import InputAmount, { InputAmountMini } from '../InputAmount';
import InteractionButton from '../InteractionButton';
import BorrowFee from './TransactionRecap/BorrowFee';
import useApprove from '../../hooks/useApprove';
import useLeverage from '../../hooks/useLeverage';
import {
  useSymbol,
  useDeadline,
  useToBigNumber,
  useUniswapAPY,
  useNextBorrowAPY,
  useNextFarmingAPY
} from '../../hooks/useData';
import getLeverage from 'utils/helpers/get-leverage';
import getLiquidationPrices from 'utils/helpers/get-liquidation-prices';
import getImpermanentLoss from 'utils/helpers/get-impermanent-loss';
import { UI_MARGIN } from 'config/general';
import getValuesFromPrice from 'utils/helpers/get-values-from-price';

export interface LeverageInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
  safetyMargin: number;
  liquidationIncentive: number;
  twapPrice: number;
  collateralDeposited: number;
  tokenADenomLPPrice: number;
  tokenBDenomLPPrice: number;
  tokenABorrowed: number;
  tokenBBorrowed: number;
  tokenAMarketDenomLPPrice: number;
  tokenBMarketDenomLPPrice: number;
  marketPrice: number;
  availableCashA: number;
  availableCashB: number;
  tokenASymbol: string;
  tokenBSymbol: string;
}

export default function LeverageInteractionModal({
  show,
  toggleShow,
  safetyMargin,
  liquidationIncentive,
  twapPrice,
  collateralDeposited,
  tokenADenomLPPrice,
  tokenBDenomLPPrice,
  tokenABorrowed,
  tokenBBorrowed,
  tokenAMarketDenomLPPrice,
  tokenBMarketDenomLPPrice,
  marketPrice,
  availableCashA,
  availableCashB,
  tokenASymbol,
  tokenBSymbol
}: LeverageInteractionModalProps): JSX.Element {
  const [val, setVal] = useState<number>(0);
  const [slippage, setSlippage] = useState<number>(2);

  const currentLeverage =
    getLeverage(
      collateralDeposited,
      tokenADenomLPPrice,
      tokenBDenomLPPrice,
      tokenABorrowed,
      tokenBBorrowed
    );

  const priceA = tokenAMarketDenomLPPrice;
  const priceB = tokenBMarketDenomLPPrice;
  const diffOne = priceA > tokenADenomLPPrice ? priceA / tokenADenomLPPrice : tokenADenomLPPrice / priceA;
  const adjustFactorOne = Math.pow(getImpermanentLoss(diffOne ** 2), val);
  const changeCollateralValue = (collateralDeposited * val / currentLeverage - collateralDeposited) * adjustFactorOne;
  const valueForEach = changeCollateralValue / 2;
  const bAmountA = priceA > 0 ? valueForEach / priceA : 0;
  const bAmountB = priceB > 0 ? valueForEach / priceB : 0;
  const cAmount = changeCollateralValue ?? 0;
  const changeAmounts = {
    bAmountA,
    bAmountB,
    cAmount,
    bAmountAMin: bAmountA / (1 + slippage / 100),
    bAmountBMin: bAmountB / (1 + slippage / 100),
    cAmountMin: cAmount / Math.sqrt(1 + slippage / 100)
  };

  const diffTwo = priceA > tokenADenomLPPrice ? priceA / tokenADenomLPPrice : tokenADenomLPPrice / priceA;
  const adjustFactorTwo = 1 / diffTwo;
  const availableCashValue1 = availableCashA * priceA;
  const availableCashValue2 = availableCashB * priceB;
  const {
    valueCollateral,
    valueA,
    valueB
  } = getValuesFromPrice(
    collateralDeposited,
    tokenADenomLPPrice,
    tokenBDenomLPPrice,
    tokenABorrowed,
    tokenBBorrowed
  );
  const safetyMarginWithUIMargin = safetyMargin * UI_MARGIN;
  const actualCollateral = valueCollateral / liquidationIncentive;
  const num1 = actualCollateral * Math.sqrt(safetyMarginWithUIMargin) - valueA * safetyMarginWithUIMargin - valueB;
  const num2 = actualCollateral * Math.sqrt(safetyMarginWithUIMargin) - valueB * safetyMarginWithUIMargin - valueA;
  const den = safetyMarginWithUIMargin + 1 - 2 * Math.sqrt(safetyMarginWithUIMargin) / liquidationIncentive;
  const additionalValueBorrowablePerSide =
    Math.min(num1 / den, num2 / den, availableCashValue1, availableCashValue2) * adjustFactorTwo;
  const valueDebt = valueA + valueB;
  const equity = valueCollateral - valueDebt;
  let maxLeverage;
  if (equity === 0) {
    maxLeverage = 1;
  } else {
    maxLeverage = (valueDebt + additionalValueBorrowablePerSide * 2) / equity + 1;
  }

  const symbol = useSymbol();
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  const deadline = useDeadline();

  const changes = {
    changeCollateral: changeAmounts.cAmount,
    changeBorrowedA: changeAmounts.bAmountA,
    changeBorrowedB: changeAmounts.bAmountB
  };
  const currentLiquidationPrices =
    getLiquidationPrices(
      collateralDeposited,
      tokenADenomLPPrice,
      tokenBDenomLPPrice,
      tokenABorrowed,
      tokenBBorrowed,
      twapPrice,
      safetyMargin,
      liquidationIncentive
    );
  const newLiquidationPrices =
    getLiquidationPrices(
      collateralDeposited,
      tokenADenomLPPrice,
      tokenBDenomLPPrice,
      tokenABorrowed,
      tokenBBorrowed,
      twapPrice,
      safetyMargin,
      liquidationIncentive,
      changes
    );
  const newLeverage =
    getLeverage(
      collateralDeposited,
      tokenADenomLPPrice,
      tokenBDenomLPPrice,
      tokenABorrowed,
      tokenBBorrowed,
      changes
    );
  const minLeverage = currentLeverage;

  useEffect(() => {
    if (val === 0) setVal(Math.ceil(minLeverage * 1000) / 1000);
  }, [minLeverage]);

  const amountA = useToBigNumber(changeAmounts.bAmountA, PoolTokenType.BorrowableA);
  const amountB = useToBigNumber(changeAmounts.bAmountB, PoolTokenType.BorrowableB);
  const amountAMin = useToBigNumber(changeAmounts.bAmountAMin, PoolTokenType.BorrowableA);
  const amountBMin = useToBigNumber(changeAmounts.bAmountBMin, PoolTokenType.BorrowableB);
  const invalidInput = val < minLeverage || val > maxLeverage;
  const [approvalStateA, onApproveA, permitDataA] = useApprove(ApprovalType.BORROW, amountA, invalidInput, PoolTokenType.BorrowableA, deadline);
  const [approvalStateB, onApproveB, permitDataB] = useApprove(ApprovalType.BORROW, amountB, invalidInput, PoolTokenType.BorrowableB, deadline);
  const [leverageState, leverage] = useLeverage(approvalStateA, approvalStateB, invalidInput, amountA, amountB, amountAMin, amountBMin, permitDataA, permitDataB);
  const onLeverage = async () => {
    await leverage();
    toggleShow(false);
  };

  const borrowAPYA = useNextBorrowAPY(changeAmounts.bAmountA, PoolTokenType.BorrowableA);
  const borrowAPYB = useNextBorrowAPY(changeAmounts.bAmountB, PoolTokenType.BorrowableB);
  const farmingPoolAPYA = useNextFarmingAPY(changeAmounts.bAmountA, PoolTokenType.BorrowableA);
  const farmingPoolAPYB = useNextFarmingAPY(changeAmounts.bAmountB, PoolTokenType.BorrowableB);
  const uniAPY = useUniswapAPY() * val;
  const borrowAPY = (borrowAPYA + borrowAPYB) / 2 * (val - 1);
  const farmingPoolAPY = (farmingPoolAPYA + farmingPoolAPYB) / 2 * (val - 1);
  const leveragedAPY = uniAPY + farmingPoolAPY - borrowAPY;

  return (
    <InteractionModalContainer
      title='Leverage'
      show={show}
      toggleShow={toggleShow}>
      <>
        <RiskMetrics
          safetyMargin={safetyMargin}
          twapPrice={twapPrice}
          changes={changes}
          currentLeverage={currentLeverage}
          newLeverage={newLeverage}
          currentLiquidationPrices={currentLiquidationPrices}
          newLiquidationPrices={newLiquidationPrices}
          marketPrice={marketPrice}
          tokenASymbol={tokenASymbol}
          tokenBSymbol={tokenBSymbol} />
        <InputAmount
          val={val}
          setVal={setVal}
          suffix='x'
          maxTitle='Max leverage'
          max={maxLeverage}
          min={minLeverage} />
        <div className='transaction-recap'>
          <Row>
            <Col
              xs={6}
              style={{ lineHeight: '30px' }}>Max slippage:
            </Col>
            <Col
              xs={6}
              className='text-right'><InputAmountMini
                val={slippage}
                setVal={setSlippage}
                suffix='%' />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>You will borrow at most:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(changeAmounts.bAmountA)} {symbolA}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>You will borrow at most:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(changeAmounts.bAmountB)} {symbolB}
            </Col>
          </Row>
          <BorrowFee
            amount={changeAmounts.bAmountA}
            symbol={symbolA} />
          <BorrowFee
            amount={changeAmounts.bAmountB}
            symbol={symbolB} />
          <Row>
            <Col xs={6}>You will get at least:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(changeAmounts.cAmountMin)} {symbol}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>Trading fees APY:</Col>
            <Col
              xs={6}
              className='text-right'>+{formatPercentage(uniAPY)}
            </Col>
          </Row>
          {(farmingPoolAPY > 0) && (
            <Row>
              <Col xs={6}>Farming APY:</Col>
              <Col
                xs={6}
                className='text-right'>+{formatPercentage(farmingPoolAPY)}
              </Col>
            </Row>
          )}
          <Row>
            <Col xs={6}>Borrow APY:</Col>
            <Col
              xs={6}
              className='text-right'>-{formatPercentage(borrowAPY)}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>Estimated APY:</Col>
            <Col
              xs={6}
              className='text-right leveraged-apy'>{formatPercentage(leveragedAPY)}
            </Col>
          </Row>
        </div>
        <Row className='interaction-row'>
          <Col xs={6}>
            <InteractionButton
              name={'Approve ' + symbolA}
              onCall={onApproveA}
              state={approvalStateA} />
          </Col>
          <Col xs={6}>
            <InteractionButton
              name={'Approve ' + symbolB}
              onCall={onApproveB}
              state={approvalStateB} />
          </Col>
        </Row>
        <Row className='interaction-row'>
          <Col>
            <InteractionButton
              name='Leverage'
              onCall={onLeverage}
              state={leverageState} />
          </Col>
        </Row>
      </>
    </InteractionModalContainer>
  );
}
