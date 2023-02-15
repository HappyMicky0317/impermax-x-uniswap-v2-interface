// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { createContext } from 'react';
import { PoolTokenType } from '../types/interfaces';

const PoolTokenContext = createContext<PoolTokenType>(null);
export default PoolTokenContext;
