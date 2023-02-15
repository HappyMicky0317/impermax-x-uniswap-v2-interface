// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { Spinner } from 'react-bootstrap';
import { CheckIcon } from '@heroicons/react/outline';
import clsx from 'clsx';

import './index.scss';

export enum ButtonState {
  Disabled = 'disabled',
  Ready = 'ready',
  Pending = 'pending',
  Done = 'done',
}

export interface Props {
  name: string;
  state: ButtonState;
  onCall(): void;
}

export default function InteractionButton({ name, onCall, state }: Props): JSX.Element {
  return (
    <button
      onClick={state === ButtonState.Ready ? onCall : null}
      type='button'
      className={'interaction-button ' + state}>
      {name}
      {state === ButtonState.Pending ? (<Spinner
        animation='border'
        size='sm' />) : null}
      {state === ButtonState.Done ? (
        <CheckIcon
          className={clsx(
            'w-6',
            'h-6'
          )} />
      ) : null}
    </button>
  );
}
