
import { useState } from 'react';
import { InteractionModalContainer } from '.';
import { Row, Col } from 'react-bootstrap';
import { PoolTokenType, ApprovalType } from '../../types/interfaces';
import RiskMetrics from '../RiskMetrics';
import { formatFloat, formatPercentage } from '../../utils/format';
import InputAmount, { InputAmountMini } from '../InputAmount';
import InteractionButton from '../InteractionButton';
import useDeleverage from '../../hooks/useDeleverage';
import useApprove from '../../hooks/useApprove';
import {
  useSymbol,
  useToBigNumber,
  useToTokens,
  useNextBorrowAPY,
  useUniswapAPY,
  useNextFarmingAPY
} from '../../hooks/useData';
import getLeverage from 'utils/helpers/get-leverage';
import getLiquidationPrices from 'utils/helpers/get-liquidation-prices';
import getMaxDeleverage from 'utils/helpers/get-max-deleverage';

interface DeleverageInteractionModalProps {
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
  tokenASymbol: string;
  tokenBSymbol: string;
}

export default function DeleverageInteractionModal({
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
  tokenASymbol,
  tokenBSymbol
}: DeleverageInteractionModalProps): JSX.Element {
  const [val, setVal] = useState<number>(0);
  const [slippage, setSlippage] = useState<number>(2);

  const priceA = tokenAMarketDenomLPPrice;
  const priceB = tokenBMarketDenomLPPrice;
  const valueForEach = val / 2;
  const bAmountA = priceA > 0 ? valueForEach / priceA : 0;
  const bAmountB = priceB > 0 ? valueForEach / priceB : 0;
  const changeAmounts = {
    bAmountA,
    bAmountB,
    cAmount: val,
    bAmountAMin: bAmountA / Math.sqrt(1 + slippage / 100),
    bAmountBMin: bAmountB / Math.sqrt(1 + slippage / 100)
  };

  const maxDeleverage =
    getMaxDeleverage(
      collateralDeposited,
      tokenAMarketDenomLPPrice,
      tokenBMarketDenomLPPrice,
      tokenABorrowed,
      tokenBBorrowed,
      slippage
    );
  const symbol = useSymbol(PoolTokenType.Collateral);
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);

  const tokens = useToTokens(val);
  const invalidInput = val > maxDeleverage;
  const amountAMin = useToBigNumber(changeAmounts.bAmountAMin, PoolTokenType.BorrowableA);
  const amountBMin = useToBigNumber(changeAmounts.bAmountBMin, PoolTokenType.BorrowableB);
  const [approvalState, onApprove, permitData] = useApprove(ApprovalType.POOL_TOKEN, tokens, invalidInput);
  const [deleverageState, deleverage] = useDeleverage(approvalState, invalidInput, tokens, amountAMin, amountBMin, permitData);
  const onDeleverage = async () => {
    await deleverage();
    setVal(0);
    toggleShow(false);
  };

  const changes = {
    changeBorrowedA: -changeAmounts.bAmountA ?? 0,
    changeBorrowedB: -changeAmounts.bAmountB ?? 0,
    changeCollateral: -changeAmounts.cAmount ?? 0
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
  const currentLeverage =
    getLeverage(
      collateralDeposited,
      tokenADenomLPPrice,
      tokenBDenomLPPrice,
      tokenABorrowed,
      tokenBBorrowed
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

  const borrowAPYA = useNextBorrowAPY(-changeAmounts.bAmountA, PoolTokenType.BorrowableA);
  const borrowAPYB = useNextBorrowAPY(-changeAmounts.bAmountB, PoolTokenType.BorrowableB);
  const farmingPoolAPYA = useNextFarmingAPY(-changeAmounts.bAmountA, PoolTokenType.BorrowableA);
  const farmingPoolAPYB = useNextFarmingAPY(-changeAmounts.bAmountB, PoolTokenType.BorrowableB);
  const uniAPY = useUniswapAPY();
  const averageAPY = (borrowAPYA + borrowAPYB - farmingPoolAPYA - farmingPoolAPYB) / 2;
  const leveragedAPY = uniAPY * newLeverage - averageAPY * (newLeverage - 1);

  return (
    <InteractionModalContainer
      title='Deleverage'
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
          suffix={symbol}
          maxTitle='Available'
          max={maxDeleverage} />
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
            <Col xs={6}>You will withdraw:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(changeAmounts.cAmount)} {symbol}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>You will repay at least:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(Math.min(changeAmounts.bAmountAMin, tokenABorrowed))} {symbolA}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>You will repay at least:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(Math.min(changeAmounts.bAmountBMin, tokenBBorrowed))} {symbolB}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>You will receive at least:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(changeAmounts.bAmountAMin > tokenABorrowed ? changeAmounts.bAmountAMin - tokenABorrowed : 0)} {symbolA}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>You will receive at least:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(changeAmounts.bAmountBMin > tokenBBorrowed ? changeAmounts.bAmountBMin - tokenBBorrowed : 0)} {symbolB}
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
              name='Approve'
              onCall={onApprove}
              state={approvalState} />
          </Col>
          <Col xs={6}>
            <InteractionButton
              name='Deleverage'
              onCall={onDeleverage}
              state={deleverageState} />
          </Col>
        </Row>
      </>
    </InteractionModalContainer>
  );
}
