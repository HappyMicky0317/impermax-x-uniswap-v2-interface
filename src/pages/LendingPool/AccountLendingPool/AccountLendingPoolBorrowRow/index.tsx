
import { useState } from 'react';
import {
  Row,
  Col,
  Button
} from 'react-bootstrap';

import InlineAccountTokenInfo from '../InlineAccountTokenInfo';
import RepayInteractionModal from 'components/InteractionModal/RepayInteractionModal';
import DisabledButtonHelper from 'components/DisabledButtonHelper';
import BorrowInteractionModal from 'components/InteractionModal/BorrowInteractionModal';

interface Props {
  collateralDepositedInUSD: number;
  tokenBorrowedInUSD: number;
  tokenBorrowed: number;
  tokenSymbol: string;
  collateralSymbol: string;
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
  maxBorrowable: number;
  tokenASymbol: string;
  tokenBSymbol: string;
}

const AccountLendingPoolBorrowRow = ({
  collateralDepositedInUSD,
  tokenBorrowedInUSD,
  tokenBorrowed,
  tokenSymbol,
  collateralSymbol,
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
  maxBorrowable,
  tokenASymbol,
  tokenBSymbol
}: Props): JSX.Element => {
  const [showBorrowModal, toggleBorrowModal] = useState(false);
  const [showRepayModal, toggleRepayModal] = useState(false);

  const borrowDisabledInfo =
    `You need to deposit ${collateralSymbol} as collateral in order to be able to borrow ${tokenSymbol}.`;
  const repayDisabledInfo = `You haven't borrowed any ${tokenSymbol} yet.`;

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
            name='Borrowed'
            symbol={tokenSymbol}
            value={tokenBorrowed}
            valueUSD={tokenBorrowedInUSD} />
        </Col>
        <Col
          md={5}
          className='btn-table'>
          <Row>
            <Col>
              {collateralDepositedInUSD > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleBorrowModal(true)}>
                  Borrow
                </Button>
              ) : (
                <DisabledButtonHelper text={borrowDisabledInfo}>
                  Borrow
                </DisabledButtonHelper>
              )}
            </Col>
            <Col>
              {tokenBorrowed > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleRepayModal(true)}>
                  Repay
                </Button>
              ) : (
                <DisabledButtonHelper text={repayDisabledInfo}>
                  Repay
                </DisabledButtonHelper>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <BorrowInteractionModal
        show={showBorrowModal}
        toggleShow={toggleBorrowModal}
        safetyMargin={safetyMargin}
        liquidationIncentive={liquidationIncentive}
        twapPrice={twapPrice}
        collateralDeposited={collateralDeposited}
        tokenADenomLPPrice={tokenADenomLPPrice}
        tokenBDenomLPPrice={tokenBDenomLPPrice}
        tokenABorrowed={tokenABorrowed}
        tokenBBorrowed={tokenBBorrowed}
        marketPrice={marketPrice}
        maxBorrowable={maxBorrowable}
        tokenASymbol={tokenASymbol}
        tokenBSymbol={tokenBSymbol} />
      <RepayInteractionModal
        show={showRepayModal}
        toggleShow={toggleRepayModal}
        tokenBorrowed={tokenBorrowed}
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
    </>
  );
};

export default AccountLendingPoolBorrowRow;
