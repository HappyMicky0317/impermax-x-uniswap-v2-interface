import { useCallback, useState } from 'react';
import Tooltip from '../Tooltip';
import { Button } from 'react-bootstrap';
import './index.scss';

export default function DisabledButtonHelper({ text, children }: { text: string, children: any }): JSX.Element {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  return (
    <span>
      <Tooltip
        text={text}
        show={show}
        placement='top'>
        <Button
          variant='primary'
          className='disabled-button-helper'
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}>{children}
        </Button>
      </Tooltip>
    </span>
  );
}
