import {
  Row,
  Col
} from 'react-bootstrap';
import { BigNumber } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import { formatUnits } from '@ethersproject/units';

import InteractionButton from 'components/InteractionButton';
import { ClaimEvent } from 'types/interfaces';
import useTrackBorrows from 'hooks/useTrackBorrows';
import useClaims from 'hooks/useClaims';
import { useTransactionUrlGenerator } from 'hooks/useUrlGenerator';
import { formatAmount } from 'utils/format';

interface Props {
  tokenABorrowedInUSD: number;
  tokenBBorrowedInUSD: number;
  collateralSymbol: string;
  farmingSharesA: BigNumber;
  farmingSharesB: BigNumber;
  availableReward: BigNumber;
  claimHistory: Array<ClaimEvent>;
}

const AccountLendingPoolFarming = ({
  tokenABorrowedInUSD,
  tokenBBorrowedInUSD,
  collateralSymbol,
  farmingSharesA,
  farmingSharesB,
  availableReward,
  claimHistory
}: Props): JSX.Element => {
  // ray test touch <<
  const urlGenerator = useTransactionUrlGenerator();
  // ray test touch >>

  const [trackBorrowsState, onTrackBorrows] = useTrackBorrows();
  const [claimsState, onClaims] = useClaims();

  // if is farming, show to reward accumulated and show a button to claim it
  if (
    availableReward.gt(Zero) ||
    (
      (tokenABorrowedInUSD > 1 && farmingSharesA.gt(Zero)) &&
      (tokenBBorrowedInUSD > 1 && farmingSharesB.gt(Zero))
    )
  ) {
    const floatAvailableReward = parseFloat(formatUnits(availableReward));

    return (
      <>
        <Row className='account-lending-pool-claim'>
          <Col
            md={12}
            className='col-claim-reward'>
            <InteractionButton
              name={'Claim ' + formatAmount(floatAvailableReward) + ' IMX'}
              onCall={onClaims}
              state={claimsState} />
          </Col>
        </Row>
        <div className='claim-history'>
          <b>Claims history</b>
          {claimHistory.map((claimEvent: ClaimEvent, index: number) => {
            return (
              <div key={index}>
                <a
                  href={urlGenerator(claimEvent.transactionHash)}
                  target='_blank'
                  rel='noopener noreferrer'>
                  Claim {formatAmount(claimEvent.amount)} IMX
                </a>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // if doesn't have anything borrowed, tell the user to borrow or leverage
  if (tokenABorrowedInUSD + tokenBBorrowedInUSD < 1) {
    return (
      <div className='account-lending-pool-farming'>
        <div className='info'>Leverage {collateralSymbol} or Borrow to start receiving the IMX reward</div>
      </div>
    );
  }

  // if has borrowed, but it is not tracked, show a button to track the LP
  return (
    <div className='account-lending-pool-farming'>
      <div className='info'>IMX reward on your borrowed position in {collateralSymbol} is not active</div>
      <div className='activate-imx-reward'>
        <InteractionButton
          name='Activate IMX Reward'
          onCall={onTrackBorrows}
          state={trackBorrowsState} />
      </div>
    </div>
  );
};

export default AccountLendingPoolFarming;
