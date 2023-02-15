import { useState } from 'react';
import { InteractionModalContainer } from '.';
import { Row, Col } from 'react-bootstrap';
import { ApprovalType } from '../../types/interfaces';
import RiskMetrics from '../RiskMetrics';
import InputAmount from '../InputAmount';
import InteractionButton from '../InteractionButton';
import useApprove from '../../hooks/useApprove';
import useRepay from '../../hooks/useRepay';
import {
  useSymbol,
  useAvailableBalance,
  useToBigNumber
} from '../../hooks/useData';
import getLeverage from 'utils/helpers/get-leverage';
import getLiquidationPrices from 'utils/helpers/get-liquidation-prices';

/**
 * Props for the deposit interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface RepayInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
  tokenBorrowed: number;
  safetyMargin: number;
  liquidationIncentive: number;
  twapPrice: number;
  collateralDeposited: number;
  tokenADenomLPPrice: number;
  tokenBDenomLPPrice: number;
  tokenABorrowed: number;
  tokenBBorrowed: number;
  marketPrice: number;
  tokenASymbol: string;
  tokenBSymbol: string;
}

/**
 * Styled component for the narrow modal.
 * @param param0 any Props for component
 * @see RepayInteractionModalProps
 */

export default function RepayInteractionModal({
  show,
  toggleShow,
  tokenBorrowed,
  safetyMargin,
  liquidationIncentive,
  twapPrice,
  collateralDeposited,
  tokenADenomLPPrice,
  tokenBDenomLPPrice,
  tokenABorrowed,
  tokenBBorrowed,
  marketPrice,
  tokenASymbol,
  tokenBSymbol
}: RepayInteractionModalProps): JSX.Element {
  const [val, setVal] = useState<number>(0);

  const symbol = useSymbol();
  const availableBalance = useAvailableBalance();

  const amount = useToBigNumber(val);
  const invalidInput = val > Math.min(availableBalance, tokenBorrowed);
  const [approvalState, onApprove] = useApprove(ApprovalType.UNDERLYING, amount, invalidInput);
  const [repayState, repay] = useRepay(approvalState, amount, invalidInput);
  const onRepay = async () => {
    await repay();
    setVal(0);
    toggleShow(false);
  };

  const changes = {
    changeCollateral: 0,
    changeBorrowedA: -val,
    changeBorrowedB: -val
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

  return (
    <InteractionModalContainer
      title='Repay'
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
          max={Math.min(availableBalance, tokenBorrowed)} />
        <Row className='interaction-row'>
          <Col xs={6}>
            <InteractionButton
              name='Approve'
              onCall={onApprove}
              state={approvalState} />
          </Col>
          <Col xs={6}>
            <InteractionButton
              name='Repay'
              onCall={onRepay}
              state={repayState} />
          </Col>
        </Row>
      </>
    </InteractionModalContainer>
  );
}
