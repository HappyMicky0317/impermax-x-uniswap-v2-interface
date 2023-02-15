// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import {
  Card,
  Spinner,
  Container,
  Row,
  Col
} from 'react-bootstrap';

import BorrowPosition from './BorrowPosition';
import SupplyPosition from './SupplyPosition';
import AccountOverallStats from './AccountOverallStats';
import {
  useBorrowPositions,
  useSupplyPositions
} from 'hooks/useAccountData';
import PairAddressContext from 'contexts/PairAddress';
import './account-content.scss';

const AccountContent = (): JSX.Element => {
  // TODO: <
  // const userData = useUserData();
  // TODO: >
  const borrowPositions = useBorrowPositions();
  const supplyPositions = useSupplyPositions();

  if (!borrowPositions || !supplyPositions) {
    return (
      <div className='spinner-container'>
        <Spinner
          animation='border'
          size='lg' />
      </div>
    );
  }

  return (
    <>
      <AccountOverallStats />
      {borrowPositions && borrowPositions.length > 0 && (
        <Container>
          <div className='positions-title'>Borrow Positions</div>
          <Card className='positions'>
            <Row className='positions-header row'>
              <Col xs={9}>Market</Col>
              <Col
                xs={3}
                className='text-right'>Net Balance
              </Col>
            </Row>
            {borrowPositions.map((pair: string, key: any) => {
              return (
                <PairAddressContext.Provider
                  value={pair}
                  key={key}>
                  <BorrowPosition />
                </PairAddressContext.Provider>
              );
            })}
          </Card>
        </Container>
      )}
      {supplyPositions && supplyPositions.length > 0 && (
        <Container>
          <div className='positions-title'>Supply Positions</div>
          <Card className='positions'>
            <Row className='positions-header row'>
              <Col xs={9}>Market</Col>
              <Col
                xs={3}
                className='text-right'>Supply Balance
              </Col>
            </Row>
            {supplyPositions.map((pair: string, key: any) => {
              return (
                <PairAddressContext.Provider
                  value={pair}
                  key={key}>
                  <SupplyPosition />
                </PairAddressContext.Provider>
              );
            })}
          </Card>
        </Container>
      )}
    </>
  );
};

export default AccountContent;
