
import { Link } from 'react-router-dom';
import {
  Row,
  Col
} from 'react-bootstrap';
import clsx from 'clsx';

import { PoolTokenType } from 'types/interfaces';
import useLendingPoolURL from 'hooks/use-lending-pool-url';
import { useTokenIcon } from 'hooks/useUrlGenerator';
import { useSuppliedAmount, useSuppliedValue } from 'hooks/useAccountData';
import { useSymbol } from 'hooks/useData';
import { formatUSD, formatAmount } from 'utils/format';

const SupplyPosition = (): JSX.Element => {
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  const suppliedAmountA = useSuppliedAmount(PoolTokenType.BorrowableA);
  const suppliedAmountB = useSuppliedAmount(PoolTokenType.BorrowableB);
  const suppliedValueA = useSuppliedValue(PoolTokenType.BorrowableA);
  const suppliedValueB = useSuppliedValue(PoolTokenType.BorrowableB);
  const tokenIconA = useTokenIcon(PoolTokenType.BorrowableA);
  const tokenIconB = useTokenIcon(PoolTokenType.BorrowableB);
  const lendingPoolUrl = useLendingPoolURL();

  return (
    <Link
      to={lendingPoolUrl}
      className='position row'>
      <Col className='currency-name d-none d-sm-block'>
        <div className='combined'>
          <div className='currency-overlapped'>
            <img
              className='inline-block'
              src={tokenIconA} />
            <img
              className='inline-block'
              src={tokenIconB} />
          </div>
          {symbolA}/{symbolB}
        </div>
      </Col>
      <Col className='supply-balance-details'>
        <Row>
          <Col className='details-amount'>
            <div>
              <img
                className={clsx(
                  'currency-icon',
                  'inline-block'
                )}
                src={tokenIconA} /> {formatAmount(suppliedAmountA)} {symbolA}
            </div>
            <div>
              <img
                className={clsx(
                  'currency-icon',
                  'inline-block'
                )}
                src={tokenIconB} /> {formatAmount(suppliedAmountB)} {symbolB}
            </div>
          </Col>
          <Col className='details-value'>
            <div>{formatUSD(suppliedValueA)}</div>
            <div>{formatUSD(suppliedValueB)}</div>
          </Col>
        </Row>
      </Col>
    </Link>
  );
};

export default SupplyPosition;
