import { Row, Col } from 'react-bootstrap';
import { formatFloat } from '../../../utils/format';

export interface BorrowFeeProps {
  amount: number;
  symbol: string;
}

export default function BorrowFee({ amount, symbol }: BorrowFeeProps): JSX.Element {
  return (
    <Row>
      <Col xs={6}>Borrow Fee:</Col>
      <Col
        xs={6}
        className='text-right'>{formatFloat(amount / 1000)} {symbol}
      </Col>
    </Row>
  );
}
