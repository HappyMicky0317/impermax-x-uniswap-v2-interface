import { useState } from 'react';
import { InteractionModalContainer } from '.';
import { Row, Col } from 'react-bootstrap';
import { PoolTokenType, ApprovalType } from '../../types/interfaces';
import usePoolToken from '../../hooks/usePoolToken';
import RiskMetrics from '../RiskMetrics';
import InputAmount from '../InputAmount';
import InteractionButton from '../InteractionButton';
import TransactionSize from './TransactionRecap/TransactionSize';
import SupplyAPY from './TransactionRecap/SupplyAPY';
import useApprove from '../../hooks/useApprove';
import useDeposit from '../../hooks/useDeposit';
import { useSymbol, useAvailableBalance, useToBigNumber } from '../../hooks/useData';
import { useAddLiquidityUrl } from '../../hooks/useUrlGenerator';
import getLeverage from 'utils/helpers/get-leverage';
import getLiquidationPrices from 'utils/helpers/get-liquidation-prices';

/**
 * Props for the deposit interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface DepositInteractionModalProps {
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
  tokenASymbol: string;
  tokenBSymbol: string;
}

export default function DepositInteractionModal({
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
  tokenASymbol,
  tokenBSymbol
}: DepositInteractionModalProps): JSX.Element {
  const poolTokenType = usePoolToken();
  const [val, setVal] = useState<number>(0);

  const symbol = useSymbol();
  const availableBalance = useAvailableBalance();
  const addLiquidityUrl = useAddLiquidityUrl();

  const amount = useToBigNumber(val);
  const invalidInput = val > availableBalance;
  const [approvalState, onApprove, permitData] = useApprove(ApprovalType.UNDERLYING, amount, invalidInput);
  const [depositState, deposit] = useDeposit(approvalState, amount, invalidInput, permitData);
  const onDeposit = async () => {
    await deposit();
    setVal(0);
    toggleShow(false);
  };

  if (!availableBalance) {
    return (
      <InteractionModalContainer
        title={poolTokenType === PoolTokenType.Collateral ? 'Deposit' : 'Supply'}
        show={show}
        toggleShow={toggleShow}>
        <>
          You need to hold {symbol} in your wallet in order to deposit it.
          {poolTokenType === PoolTokenType.Collateral ? (
            <>
              <br />
              You can obtain it by&nbsp;
              <a
                target='_blank'
                href={addLiquidityUrl}
                rel='noopener noreferrer'>
                providing liquidity on Uniswap
              </a>
            </>
          ) : null}
        </>
      </InteractionModalContainer>
    );
  }

  const changes = {
    changeCollateral: val,
    changeBorrowedA: 0,
    changeBorrowedB: 0
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
      title={poolTokenType === PoolTokenType.Collateral ? 'Deposit' : 'Supply'}
      show={show}
      toggleShow={toggleShow}>
      <>
        {poolTokenType === PoolTokenType.Collateral && (
          <RiskMetrics
            hideIfNull={true}
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
        )}
        <InputAmount
          val={val}
          setVal={setVal}
          suffix={symbol}
          maxTitle='Available'
          max={availableBalance} />
        <div className='transaction-recap'>
          <TransactionSize
            amount={val}
            tokenADenomLPPrice={tokenADenomLPPrice}
            tokenBDenomLPPrice={tokenBDenomLPPrice} />
          <SupplyAPY amount={val} />
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
              name={poolTokenType === PoolTokenType.Collateral ? 'Deposit' : 'Supply'}
              onCall={onDeposit}
              state={depositState} />
          </Col>
        </Row>
      </>
    </InteractionModalContainer>
  );
}
