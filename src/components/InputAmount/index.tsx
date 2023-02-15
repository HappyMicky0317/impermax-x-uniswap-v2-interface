import { useState, useEffect } from 'react';
import { InputGroup } from 'react-bootstrap';
import NumericalInput from './NumericalInput';
import { formatFloat } from '../../utils/format';
import './index.scss';

interface InputAmountProps {
  val: number;
  setVal(input: number): void;
  suffix: string;
  maxTitle: string;
  max: number;
  min?: number;
}

interface InputAmountMiniProps {
  val: number;
  setVal(input: number): void;
  suffix: string;
}

export function InputAmountMini({ val, setVal, suffix }: InputAmountMiniProps): JSX.Element {
  const [stringVal, setStringVal] = useState<string>(val.toString());
  const onUserInput = (input: string) => setStringVal(input);
  // TODO: <
  // const onMax = () => setStringVal(formatFloat(max).toString());
  // const step = max ? Math.pow(10, Math.floor(Math.log10(max)) - 2) : 0;
  // min = min ? min : 0;
  // TODO: >
  useEffect(() => {
    const newVal = stringVal ? parseFloat(stringVal) : 0;
    if (val === newVal) return; // avoid infinite loop
    setVal(newVal);
  }, [stringVal]);
  useEffect(() => {
    const newStringVal = formatFloat(val);
    if (stringVal === newStringVal) return; // avoid infinite loop
    setStringVal(newStringVal);
  }, [val]);

  return (
    <div className='input-amount-mini'>
      <InputGroup className='input-container'>
        <NumericalInput
          value={stringVal}
          onUserInput={input => {
            onUserInput(input);
          }} />
        <InputGroup.Append className='suffix'>
          <span>{suffix}</span>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
}

export default function InputAmount({ val, setVal, suffix, maxTitle, max, min }: InputAmountProps): JSX.Element {
  const [stringVal, setStringVal] = useState<string>(val.toString());
  const onUserInput = (input: string) => setStringVal(input);
  const onMax = () => setStringVal(formatFloat(max).toString());
  const step = max ? Math.pow(10, Math.floor(Math.log10(max)) - 2) : 0;
  min = min ? min : 0;
  useEffect(() => {
    const newVal = stringVal ? parseFloat(stringVal) : 0;
    if (val === newVal) return; // avoid infinite loop
    setVal(newVal);
  }, [stringVal]);
  useEffect(() => {
    const newStringVal = formatFloat(val);
    if (stringVal === newStringVal) return; // avoid infinite loop
    setStringVal(newStringVal);
  }, [val]);

  return (
    <>
      <div className='input-amount'>
        <InputGroup className='available'>
          {maxTitle}: {formatFloat(max)} {suffix}
        </InputGroup>
        <InputGroup className='input-container mb-3'>
          <InputGroup.Prepend className='max-input'>
            <button
              onClick={onMax}
              type='button'>
              MAX
            </button>
          </InputGroup.Prepend>
          <NumericalInput
            value={stringVal}
            onUserInput={input => {
              onUserInput(input);
            }} />
          <InputGroup.Append className='suffix'>
            <span>{suffix}</span>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <input
        type='range'
        className='form-range'
        value={val}
        step={step}
        min={step ? min - min % step + step : 0}
        max={step ? max - max % step : 0}
        onChange={event => setVal(parseFloat(event.target.value))} />
    </>
  );
}
