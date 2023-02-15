
import { useState } from 'react';
import {
  Row,
  Col,
  Button
} from 'react-bootstrap';

import InlineAccountTokenInfo from '../InlineAccountTokenInfo';
import DepositInteractionModal from 'components/InteractionModal/DepositInteractionModal';
import LeverageInteractionModal from 'components/InteractionModal/LeverageInteractionModal';
import WithdrawInteractionModal from 'components/InteractionModal/WithdrawInteractionModal';
import DeleverageInteractionModal from 'components/InteractionModal/DeleverageInteractionModal';
import DisabledButtonHelper from 'components/DisabledButtonHelper';
import getMaxDeleverage from 'utils/helpers/get-max-deleverage';

interface Props {
  collateralDepositedInUSD: number;
  collateralSymbol: string;
  tokenAIconPath: string;
  tokenBIconPath: string;
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
  maxWithdrawable: number;
  tokenASymbol: string;
  tokenBSymbol: string;
}

const AccountLendingPoolLPRow = ({
  collateralDepositedInUSD,
  collateralSymbol,
  tokenAIconPath,
  tokenBIconPath,
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
  maxWithdrawable,
  tokenASymbol,
  tokenBSymbol
}: Props): JSX.Element => {
  const [showDepositModal, toggleDepositModal] = useState(false);
  const [showWithdrawModal, toggleWithdrawModal] = useState(false);
  const [showLeverageModal, toggleLeverageModal] = useState(false);
  const [showDeleverageModal, toggleDeleverageModal] = useState(false);

  const maxDeleverage =
    getMaxDeleverage(
      collateralDeposited,
      tokenAMarketDenomLPPrice,
      tokenBMarketDenomLPPrice,
      tokenABorrowed,
      tokenBBorrowed,
      0
    );
  const withdrawDisabledInfo = `You haven't deposited any ${collateralSymbol} yet.`;
  const leverageDisabledInfo = `You need to deposit the ${collateralSymbol} LP first in order to leverage it.`;
  const deleverageDisabledInfo = `You need to open a leveraged position in order to deleverage it.`;

  return (
    <>
      <Row className='account-lending-pool-row'>
        <Col md={3}>
          <Row className='account-lending-pool-name-icon'>
            <Col className='token-icon icon-overlapped'>
              <img
                className='inline-block'
                src={tokenAIconPath}
                alt='' />
              <img
                className='inline-block'
                src={tokenBIconPath}
                alt='' />
            </Col>
            <Col className='token-name'>
              {`${collateralSymbol} LP`}
            </Col>
          </Row>
        </Col>
        <Col
          md={4}
          className='inline-account-token-info-container'>
          <InlineAccountTokenInfo
            name='Deposited'
            symbol='LP'
            value={collateralDeposited}
            valueUSD={collateralDepositedInUSD} />
        </Col>
        <Col
          md={5}
          className='btn-table'>
          <Row>
            <Col>
              <Button
                variant='primary'
                onClick={() => toggleDepositModal(true)}>
                Deposit
              </Button>
            </Col>
            <Col>
              {collateralDepositedInUSD > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleWithdrawModal(true)}>
                  Withdraw
                </Button>
              ) : (
                <DisabledButtonHelper text={withdrawDisabledInfo}>
                  Withdraw
                </DisabledButtonHelper>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              {collateralDepositedInUSD > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleLeverageModal(true)}>
                  Leverage
                </Button>
              ) : (
                <DisabledButtonHelper text={leverageDisabledInfo}>
                  Leverage
                </DisabledButtonHelper>
              )}
            </Col>
            <Col>
              {maxDeleverage > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleDeleverageModal(true)}>
                  Deleverage
                </Button>
              ) : (
                <DisabledButtonHelper text={deleverageDisabledInfo}>
                  Deleverage
                </DisabledButtonHelper>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <DepositInteractionModal
        show={showDepositModal}
        toggleShow={toggleDepositModal}
        safetyMargin={safetyMargin}
        liquidationIncentive={liquidationIncentive}
        twapPrice={twapPrice}
        collateralDeposited={collateralDeposited}
        tokenADenomLPPrice={tokenADenomLPPrice}
        tokenBDenomLPPrice={tokenBDenomLPPrice}
        tokenABorrowed={tokenABorrowed}
        tokenBBorrowed={tokenBBorrowed}
        marketPrice={marketPrice}
        tokenASymbol={tokenASymbol}
        tokenBSymbol={tokenBSymbol} />
      <WithdrawInteractionModal
        show={showWithdrawModal}
        toggleShow={toggleWithdrawModal}
        safetyMargin={safetyMargin}
        liquidationIncentive={liquidationIncentive}
        twapPrice={twapPrice}
        collateralDeposited={collateralDeposited}
        tokenADenomLPPrice={tokenADenomLPPrice}
        tokenBDenomLPPrice={tokenBDenomLPPrice}
        tokenABorrowed={tokenABorrowed}
        tokenBBorrowed={tokenBBorrowed}
        marketPrice={marketPrice}
        maxWithdrawable={maxWithdrawable}
        tokenASymbol={tokenASymbol}
        tokenBSymbol={tokenBSymbol} />
      <LeverageInteractionModal
        show={showLeverageModal}
        toggleShow={toggleLeverageModal}
        safetyMargin={safetyMargin}
        liquidationIncentive={liquidationIncentive}
        twapPrice={twapPrice}
        collateralDeposited={collateralDeposited}
        tokenADenomLPPrice={tokenADenomLPPrice}
        tokenBDenomLPPrice={tokenBDenomLPPrice}
        tokenABorrowed={tokenABorrowed}
        tokenBBorrowed={tokenBBorrowed}
        tokenAMarketDenomLPPrice={tokenAMarketDenomLPPrice}
        tokenBMarketDenomLPPrice={tokenBMarketDenomLPPrice}
        marketPrice={marketPrice}
        availableCashA={availableCashA}
        availableCashB={availableCashB}
        tokenASymbol={tokenASymbol}
        tokenBSymbol={tokenBSymbol} />
      <DeleverageInteractionModal
        show={showDeleverageModal}
        toggleShow={toggleDeleverageModal}
        safetyMargin={safetyMargin}
        liquidationIncentive={liquidationIncentive}
        twapPrice={twapPrice}
        collateralDeposited={collateralDeposited}
        tokenADenomLPPrice={tokenADenomLPPrice}
        tokenBDenomLPPrice={tokenBDenomLPPrice}
        tokenABorrowed={tokenABorrowed}
        tokenBBorrowed={tokenBBorrowed}
        tokenAMarketDenomLPPrice={tokenAMarketDenomLPPrice}
        tokenBMarketDenomLPPrice={tokenBMarketDenomLPPrice}
        marketPrice={marketPrice}
        tokenASymbol={tokenASymbol}
        tokenBSymbol={tokenBSymbol} />
    </>
  );
};

export default AccountLendingPoolLPRow;
