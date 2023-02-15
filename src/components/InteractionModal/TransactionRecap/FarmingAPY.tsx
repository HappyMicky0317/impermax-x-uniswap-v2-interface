import { Row, Col } from 'react-bootstrap';
import { PoolTokenType } from '../../../types/interfaces';
import usePoolToken from '../../../hooks/usePoolToken';
import { formatPercentage } from '../../../utils/format';
import { useNextFarmingAPY } from '../../../hooks/useData';

export default function FarmingAPY({ amount }: { amount: number }): JSX.Element | null {
  const poolTokenType = usePoolToken();
  if (poolTokenType === PoolTokenType.Collateral) return null;

  // TODO: <
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const farmingAPY = useNextFarmingAPY(amount);
  // TODO: >

  return (
    <Row>
      <Col xs={6}>Farming APY:</Col>
      <Col
        xs={6}
        className='text-right'>{formatPercentage(farmingAPY)}
      </Col>
    </Row>
  );
}
