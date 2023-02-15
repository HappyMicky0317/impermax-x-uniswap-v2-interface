import { useState } from 'react';
import { InteractionModalContainer } from '.';
import { Row, Col } from 'react-bootstrap';
import { ApprovalType } from '../../types/interfaces';
import InputAmount from '../InputAmount';
import InteractionButton from '../InteractionButton';
import BorrowAPY from './TransactionRecap/BorrowAPY';
import BorrowFee from './TransactionRecap/BorrowFee';
import useApprove from '../../hooks/useApprove';
import useBorrow from '../../hooks/useBorrow';
import {
  useSymbol,
  useToBigNumber
} from '../../hooks/useData';
import RiskMetrics from '../RiskMetrics';
import FarmingAPY from './TransactionRecap/FarmingAPY';
import getLeverage from 'utils/helpers/get-leverage';
import getLiquidationPrices from 'utils/helpers/get-liquidation-prices';

/**
 * Props for the deposit interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface BorrowInteractionModalProps {
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
  marketPrice: number;
  maxBorrowable: number;
  tokenASymbol: string;
  tokenBSymbol: string;
}

/**
 * Styled component for the narrow modal.
 * @param param0 any Props for component
 * @see BorrowInteractionModalProps
 */

export default function BorrowInteractionModal({
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
  marketPrice,
  maxBorrowable,
  tokenASymbol,
  tokenBSymbol
}: BorrowInteractionModalProps): JSX.Element {
  const [val, setVal] = useState<number>(0);

  const symbol = useSymbol();

  const amount = useToBigNumber(val);
  const invalidInput = val > maxBorrowable;
  const [approvalState, onApprove, permitData] = useApprove(ApprovalType.BORROW, amount, invalidInput);
  const [borrowState, borrow] = useBorrow(approvalState, amount, invalidInput, permitData);
  const onBorrow = async () => {
    await borrow();
    setVal(0);
    toggleShow(false);
  };

  const changes = {
    changeCollateral: 0,
    changeBorrowedA: val,
    changeBorrowedB: val
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
      title='Borrow'
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
          max={maxBorrowable} />
        <div className='transaction-recap'>
          <BorrowFee
            amount={val}
            symbol={symbol} />
          <BorrowAPY amount={val} />
          <FarmingAPY amount={val} />
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
              name='Borrow'
              onCall={onBorrow}
              state={borrowState} />
          </Col>
        </Row>
      </>
    </InteractionModalContainer>
  );
}
