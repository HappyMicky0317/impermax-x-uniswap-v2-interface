import { Row, Col } from 'react-bootstrap';
import { formatUSD, formatFloat } from 'utils/format';

function InlineAccountTokenInfo({ name, symbol, value, valueUSD }: InlineAccountTokenInfoProps): JSX.Element {
  return (
    <Row className='inline-account-token-info'>
      <Col className='name'>
        {name}:
      </Col>
      <Col className='values'>
        <Row>
          <Col>{formatFloat(value)} {symbol}</Col>
        </Row>
        <Row>
          <Col>{formatUSD(valueUSD)}</Col>
        </Row>
      </Col>
    </Row>
  );
}

export interface InlineAccountTokenInfoProps {
  name: string;
  symbol: string;
  value: number;
  valueUSD: number;
}

export default InlineAccountTokenInfo;
