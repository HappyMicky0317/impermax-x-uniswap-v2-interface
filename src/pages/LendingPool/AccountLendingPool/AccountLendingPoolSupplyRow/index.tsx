
import { useState } from 'react';
import {
  Row,
  Col,
  Button
} from 'react-bootstrap';

import InlineAccountTokenInfo from '../InlineAccountTokenInfo';
import DepositInteractionModal from 'components/InteractionModal/DepositInteractionModal';
import DisabledButtonHelper from 'components/DisabledButtonHelper';
import WithdrawInteractionModal from 'components/InteractionModal/WithdrawInteractionModal';

interface Props {
  collateralDepositedInUSD: number;
  tokenSymbol: string;
  tokenIconPath: string;
  safetyMargin: number;
  liquidationIncentive: number;
  twapPrice: number;
  collateralDeposited: number;
  tokenADenomLPPrice: number;
  tokenBDenomLPPrice: number;
  tokenABorrowed: number;
  tokenBBorrowed: number;
  marketPrice: number;
  maxWithdrawable: number;
  tokenASymbol: string;
  tokenBSymbol: string;
}

const AccountLendingPoolSupplyRow = ({
  collateralDepositedInUSD,
  tokenSymbol,
  tokenIconPath,
  safetyMargin,
  liquidationIncentive,
  twapPrice,
  collateralDeposited,
  tokenADenomLPPrice,
  tokenBDenomLPPrice,
  tokenABorrowed,
  tokenBBorrowed,
  marketPrice,
  maxWithdrawable,
  tokenASymbol,
  tokenBSymbol
}: Props): JSX.Element => {
  const [showDepositModal, toggleDepositModal] = useState(false);
  const [showWithdrawModal, toggleWithdrawModal] = useState(false);

  const withdrawDisabledInfo = `You haven't supplied any ${tokenSymbol} yet.`;

  return (
    <>
      <Row className='account-lending-pool-row'>
        <Col md={3}>
          <Row className='account-lending-pool-name-icon'>
            <Col className='token-icon'>
              <img
                className='inline-block'
                src={tokenIconPath}
                alt='' />
            </Col>
            <Col className='token-name'>
              {`${tokenSymbol}`}
            </Col>
          </Row>
        </Col>
        <Col
          md={4}
          className='inline-account-token-info-container'>
          <InlineAccountTokenInfo
            name='Supplied'
            symbol={tokenSymbol}
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
                Supply
              </Button>
            </Col>
            <Col>
              {maxWithdrawable > 0 ? (
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
    </>
  );
};

export default AccountLendingPoolSupplyRow;
