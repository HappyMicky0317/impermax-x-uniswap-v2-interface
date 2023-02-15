
import {
  Row,
  Col
} from 'react-bootstrap';
import usePoolToken from 'hooks/usePoolToken';
import { useSymbol } from 'hooks/useData';
import { formatFloat } from 'utils/format';
import { PoolTokenType } from 'types/interfaces';

interface Props {
  amount: number;
  tokenADenomLPPrice: number;
  tokenBDenomLPPrice: number;
}

const TransactionSize = ({
  amount,
  tokenADenomLPPrice,
  tokenBDenomLPPrice
}: Props): JSX.Element | null => {
  const poolTokenType = usePoolToken();
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);

  if (poolTokenType !== PoolTokenType.Collateral) return null;

  return (
    <Row>
      <Col xs={6}>Transaction size:</Col>
      <Col
        xs={6}
        className='text-right'>
        {formatFloat(amount / 2 / tokenADenomLPPrice)} {symbolA}
        <br /> +
        {formatFloat(amount / 2 / tokenBDenomLPPrice)} {symbolB}
      </Col>
    </Row>
  );
};

export default TransactionSize;
